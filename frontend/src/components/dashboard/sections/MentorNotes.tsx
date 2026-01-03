"use client";

import { motion } from "framer-motion";
import { MessageSquare, User, Clock, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MentorNote } from "@/types/dashboard";
import { useAuth } from "@/context/AuthContext";

interface MentorNotesProps {
  notes: MentorNote[];
  loading?: boolean;
}

export default function MentorNotes({ notes, loading = false }: MentorNotesProps) {
  const { user } = useAuth();

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Mentor Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg bg-muted/30 animate-pulse">
                <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notes.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Mentor Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No mentor notes</p>
            <p className="text-sm text-muted-foreground mt-2">Your mentor will share feedback and guidance here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter notes based on user role and visibility
  const getVisibleNotes = () => {
    if (!user) return [];
    
    return notes.filter(note => {
      // User can see notes visible to 'user'
      if (user.role === 'MEMBER') {
        return note.visibleTo === 'user';
      }
      // Mentor and Admin can see all notes
      return true;
    });
  };

  const visibleNotes = getVisibleNotes();

  if (visibleNotes.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Mentor Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notes available</p>
            <p className="text-sm text-muted-foreground mt-2">
              {user?.role === 'MEMBER' 
                ? 'Your mentor hasn&apos;t shared any notes with you yet'
                : 'No mentor notes to display'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getVisibilityIcon = (visibleTo: string) => {
    switch (visibleTo) {
      case 'user':
        return <Eye className="w-4 h-4 text-green-500" />;
      case 'mentor':
        return <EyeOff className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <EyeOff className="w-4 h-4 text-red-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getVisibilityText = (visibleTo: string) => {
    switch (visibleTo) {
      case 'user':
        return 'Visible to User';
      case 'mentor':
        return 'Mentor Only';
      case 'admin':
        return 'Admin Only';
      default:
        return 'Private';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Mentor Notes
          {user?.role !== 'MEMBER' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              {visibleNotes.length} / {notes.length} visible
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibleNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`p-4 border rounded-lg transition-all ${
                note.priority === 'high' 
                  ? 'bg-red-50 border-red-200' 
                  : note.priority === 'medium'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              {/* Note Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getPriorityIcon(note.priority)}
                  <div>
                    <h3 className="font-semibold">{note.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{note.mentorName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(note.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(note.priority)}`}>
                    {note.priority}
                  </span>
                  {user?.role !== 'MEMBER' && (
                    <div className="flex items-center gap-1">
                      {getVisibilityIcon(note.visibleTo)}
                      <span className="text-xs text-muted-foreground">
                        {getVisibilityText(note.visibleTo)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Note Content */}
              <div className="text-sm text-gray-700 leading-relaxed">
                {note.content}
              </div>

              {/* Note Footer */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    From: {note.mentorName}
                  </div>
                  {user?.role !== 'MEMBER' && (
                    <div className="text-xs text-muted-foreground">
                      ID: {note.id}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Visibility Legend for non-members */}
          {user?.role !== 'MEMBER' && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Visibility Levels</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3 text-green-500" />
                  <span>Visible to User - Student can see this note</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="w-3 h-3 text-yellow-500" />
                  <span>Mentor Only - Only mentors can see this note</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="w-3 h-3 text-red-500" />
                  <span>Admin Only - Only admins can see this note</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
