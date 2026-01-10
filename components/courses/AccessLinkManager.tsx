'use client';

import { useState } from 'react';
import { createAccessLink, deactivateLink } from '@/lib/actions/access.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Copy, Link as LinkIcon, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface AccessLink {
  _id: string;
  code: string;
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

interface AccessLinkManagerProps {
  courseId: string;
  courseName: string;
  links: AccessLink[];
}

export default function AccessLinkManager({ courseId, courseName, links: initialLinks }: AccessLinkManagerProps) {
  const [links, setLinks] = useState(initialLinks);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [maxUses, setMaxUses] = useState('100');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCreateLink = async () => {
    setLoading(true);

    const result = await createAccessLink({
      courseId,
      maxUses: parseInt(maxUses, 10) || 100,
    });

    if (result.error) {
      toast.error(typeof result.error === 'string' ? result.error : 'Failed to create link');
      setLoading(false);
      return;
    }

    if (result.code) {
      setLinks(prev => [{
        _id: result.linkId!,
        code: result.code!,
        maxUses: parseInt(maxUses, 10) || 100,
        currentUses: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      }, ...prev]);
      
      toast.success('Access link created!');
      setOpen(false);
      setMaxUses('100');
    }

    setLoading(false);
  };

  const handleDeactivate = async (linkId: string) => {
    const result = await deactivateLink(linkId);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setLinks(prev => prev.map(link => 
      link._id === linkId ? { ...link, isActive: false } : link
    ));
    
    toast.success('Link deactivated');
  };

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/redeem/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(code);
    toast.success('Link copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Access Links
        </h3>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-1" />
              New Link
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create Access Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <p className="text-slate-400 text-sm">
                Create a link for students to access reviews for <span className="text-white">{courseName}</span>
              </p>
              
              <div className="space-y-2">
                <Label className="text-slate-200">Maximum Uses</Label>
                <Input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  min="1"
                  max="1000"
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <p className="text-slate-500 text-xs">How many students can use this link</p>
              </div>

              <Button
                onClick={handleCreateLink}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Link'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link) => (
            <Card key={link._id} className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-grow mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-purple-400 text-sm">{link.code}</code>
                      <Badge className={link.isActive 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {link.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{link.currentUses}/{link.maxUses} uses</span>
                      <span>Created {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyLink(link.code)}
                      className="text-slate-400 hover:text-white"
                    >
                      {copied === link.code ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    {link.isActive && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeactivate(link._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="text-center py-8">
            <LinkIcon className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No access links yet. Create one to share with students.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
