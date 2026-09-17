import {Check, ImagePlus, LoaderCircle, Mail, Save, UserRound} from 'lucide-react';
import {useEffect, useRef, useState, type ChangeEvent} from 'react';
import Avatar from '../components/Avatar';
import {syncSub2ApiProfile, updateHackadminProfile, uploadHackadminAvatar} from '../lib/api';
import type {User} from '../lib/types';

type Props = {user: User; onUserChange: (user: User) => void};

export default function ProfilePage({user, onUserChange}: Props) {
  const [nickname, setNickname] = useState(user.nickname || '');
  const [city, setCity] = useState(user.city || '');
  const [github, setGithub] = useState(user.github_username || '');
  const [website, setWebsite] = useState(user.website_url || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setNickname(user.nickname || ''); setCity(user.city || ''); setGithub(user.github_username || ''); setWebsite(user.website_url || ''); }, [user]);

  async function save() {
    if (!nickname.trim()) { setError('昵称不能为空'); return; }
    setSaving(true); setNotice(''); setError('');
    try {
      const updated = await updateHackadminProfile({nickname: nickname.trim(), city: city.trim(), github_username: github.trim(), website_url: website.trim()});
      onUserChange(updated);
      try { await syncSub2ApiProfile({username: updated.nickname, avatar_url: absoluteAvatar(updated.avatar_url)}); setNotice('资料已保存，并已同步到统一账号。'); }
      catch { setNotice('资料已保存到会员中心，但统一账号同步失败，请稍后再次保存。'); }
    } catch (reason) { setError(reason instanceof Error ? reason.message : '保存资料失败'); }
    finally { setSaving(false); }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) { setError('头像只支持 JPG 或 PNG'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('头像不能超过 5 MB'); return; }
    setUploading(true); setNotice(''); setError('');
    try {
      const updated = await uploadHackadminAvatar(file);
      onUserChange(updated);
      try { await syncSub2ApiProfile({username: updated.nickname, avatar_url: absoluteAvatar(updated.avatar_url)}); setNotice('头像已上传，并已同步到统一账号。'); }
      catch { setNotice('头像已上传到会员中心，但统一账号同步失败，请稍后重试。'); }
    } catch (reason) { setError(reason instanceof Error ? reason.message : '上传头像失败'); }
    finally { setUploading(false); }
  }

  return <>
    <header className="page-header compact"><div><p className="eyebrow dark">ACCOUNT / PROFILE</p><h1>个人资料</h1><p className="lead">更新其他会员看到的名字和头像，资料会同步到 HackStart 统一账号。</p></div></header>
    <div className="profile-layout">
      <section className="profile-card profile-identity"><div className="profile-avatar-wrap"><Avatar user={user} size="large" /><button className="avatar-edit" title="上传头像" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? <LoaderCircle className="spin" size={16} /> : <ImagePlus size={16} />}</button><input ref={fileRef} type="file" accept="image/jpeg,image/png" hidden onChange={upload} /></div><h2>{user.nickname || 'HackStart 用户'}</h2><p>{user.email}</p><span className="identity-chip"><Check size={13} />统一账号已连接</span><p className="identity-note">头像支持 JPG、PNG，大小不超过 5 MB。</p></section>
      <section className="profile-card"><div className="card-heading"><div><p className="eyebrow dark">PUBLIC PROFILE</p><h2>公开资料</h2></div><UserRound size={19} /></div><label className="field-label">昵称<span className="input-wrap"><UserRound size={16} /><input value={nickname} maxLength={40} onChange={(event) => setNickname(event.target.value)} placeholder="其他会员看到的名字" /></span></label><label className="field-label">邮箱地址<span className="input-wrap readonly"><Mail size={16} /><input value={user.email} readOnly /></span></label><div className="form-grid"><label className="field-label">所在城市<input value={city} maxLength={80} onChange={(event) => setCity(event.target.value)} placeholder="例如：上海" /></label><label className="field-label">GitHub 用户名<input value={github} maxLength={39} onChange={(event) => setGithub(event.target.value)} placeholder="octocat" /></label></div><label className="field-label">个人网站<input value={website} maxLength={300} onChange={(event) => setWebsite(event.target.value)} placeholder="https://example.com" /></label>{notice && <p className="notice success-notice"><Check size={16} />{notice}</p>}{error && <p className="notice error-notice">{error}</p>}<div className="form-actions"><button className="primary-button" onClick={() => void save()} disabled={saving || uploading}>{saving ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}保存资料</button></div></section>
    </div>
  </>;
}

function absoluteAvatar(value: string): string {
  if (!value) return '';
  return value.startsWith('/') ? `https://hackadmin.hackweek.org${value}` : value;
}
