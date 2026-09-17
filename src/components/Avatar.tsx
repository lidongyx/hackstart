import {UserRound} from 'lucide-react';
import type {User} from '../lib/types';

type Props = {user: Pick<User, 'nickname' | 'avatar_url'>; size?: 'small' | 'large'};

export default function Avatar({user, size = 'small'}: Props) {
  return <span className={`avatar avatar-${size}`} aria-hidden="true">
    {user.avatar_url ? <img src={user.avatar_url.startsWith('/') ? `https://hackadmin.hackweek.org${user.avatar_url}` : user.avatar_url} alt="" /> : <><UserRound size={size === 'large' ? 28 : 17} /><b>{(user.nickname || '?').slice(0, 1).toUpperCase()}</b></>}
  </span>;
}
