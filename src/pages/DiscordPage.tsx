import type { DiscordPageData } from '../types';
import { TextField } from '../components/TextField';
import { AddableList } from '../components/AddableList';
import './DiscordPage.css';

interface DiscordPageProps {
  data: DiscordPageData;
  onBotTokenChange: (token: string) => void;
  onAdminChannelIdChange: (id: string) => void;
  onLogChannelIdChange: (id: string) => void;
  onAddUserChannelId: (id: string) => void;
  onRemoveUserChannelId: (index: number) => void;
}

export function DiscordPage({
  data,
  onBotTokenChange,
  onAdminChannelIdChange,
  onLogChannelIdChange,
  onAddUserChannelId,
  onRemoveUserChannelId,
}: DiscordPageProps) {
  return (
    <div className="discord-page">
      <TextField label="Bot Token" value={data.botToken} onChange={onBotTokenChange} />
      <TextField label="Admin Channel ID" value={data.adminChannelId} onChange={onAdminChannelIdChange} />
      <TextField label="Log Channel ID" value={data.logChannelId} onChange={onLogChannelIdChange} />
      <AddableList
        label="User Channel IDs"
        items={data.userChannelIds}
        onAdd={onAddUserChannelId}
        onRemove={onRemoveUserChannelId}
      />
    </div>
  );
}
