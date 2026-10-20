import { BookOpen, Globe, Video, GitBranch, Wrench, Palette, Link } from 'lucide-react';

const MAP = { article: BookOpen, website: Globe, video: Video, github: GitBranch, tool: Wrench, design: Palette, other: Link };

export default function TypeIcon({ type, size = 14 }) {
  const Icon = MAP[type] || Link;
  return <Icon size={size} aria-hidden="true" />;
}
