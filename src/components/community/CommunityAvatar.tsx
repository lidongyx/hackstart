import React, {useEffect, useState} from 'react';

export type CommunityUser = {
  id?: number | string;
  username?: string;
  nickname?: string;
  email?: string;
  avatar_url?: string;
};

export function communityDisplayName(user?: CommunityUser | null): string {
  return user?.username?.trim()
    || user?.nickname?.trim()
    || user?.email?.trim()
    || 'HackStart 用户';
}

export function communityInitials(user?: CommunityUser | null): string {
  return communityDisplayName(user).slice(0, 1).toUpperCase() || 'H';
}

type Props = {
  readonly user?: CommunityUser | null;
  readonly className?: string;
};

export default function CommunityAvatar({user, className}: Props): React.ReactNode {
  const avatarURL = user?.avatar_url?.trim() || '';
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [avatarURL]);

  return <span className={className} aria-label={`${communityDisplayName(user)}的头像`}>
    {avatarURL && !failed
      ? <img src={avatarURL} alt="" onError={() => setFailed(true)} />
      : communityInitials(user)}
  </span>;
}
