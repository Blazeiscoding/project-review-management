import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Please add CLERK_WEBHOOK_SECRET to .env');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    await connectDB();

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Create user in MongoDB
      await User.create({
        clerkId: id,
        email: email_addresses[0]?.email_address || '',
        firstName: first_name || 'User',
        lastName: last_name || '',
        profileImage: image_url,
        role: 'student', // Default role, will be updated during onboarding
        onboardingComplete: false,
      });

      console.log('User created in MongoDB:', id);
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Update user in MongoDB
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          profileImage: image_url,
        }
      );

      console.log('User updated in MongoDB:', id);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      // Delete user from MongoDB
      await User.findOneAndDelete({ clerkId: id });

      console.log('User deleted from MongoDB:', id);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}
