import type { DiscordPageData } from '../types';
import { TextField } from '../components/TextField';
import { AddableList } from '../components/AddableList';
import './DiscordPage.css';

interface DiscordPageProps {
  data: DiscordPageData;
  onBotTokenChange: (token: string) => void;
  onAdminRoleIdChange: (id: string) => void;
  onAddChannelId: (id: string) => void;
  onRemoveChannelId: (index: number) => void;
}

export function DiscordPage({
  data,
  onBotTokenChange,
  onAdminRoleIdChange,
  onAddChannelId,
  onRemoveChannelId,
}: DiscordPageProps) {
  return (
    <div className="discord-page">
      <TextField label="Bot Token" value={data.botToken} onChange={onBotTokenChange} />
      <TextField label="Admin Role ID" value={data.adminRoleId} onChange={onAdminRoleIdChange} />
      <AddableList
        label="Channel IDs"
        items={data.channelIds}
        onAdd={onAddChannelId}
        onRemove={onRemoveChannelId}
      />
    </div>
  );
}
