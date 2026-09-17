import React, {useEffect, useRef, useState, type ChangeEvent, type FormEvent} from 'react';
import {ImagePlus, LoaderCircle, Save, UserRound} from 'lucide-react';
import AccountShell from '@site/src/components/account/AccountShell';
import styles from '@site/src/components/account/styles.module.css';
import {avatarURL, syncSub2ApiProfile, updateHackadminProfile, uploadHackadminAvatar} from '@site/src/lib/api';
import {notifySub2ApiAuthChanged} from '@site/src/lib/sub2api-auth';
import type {User} from '@site/src/lib/types';

function ProfileForm({user, updateUser}: {user: User; updateUser: (user: User) => void}) {
  const [form, setForm] = useState({nickname: '', city: '', github_username: '', website_url: ''});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {setForm({nickname: user.nickname || '', city: user.city || '', github_username: user.github_username || '', website_url: user.website_url || ''});}, [user]);
  async function sync(updated: User) {
    updateUser(updated);
    try {
      await syncSub2ApiProfile({username: updated.nickname, avatar_url: avatarURL(updated.avatar_url || '')});
      notifySub2ApiAuthChanged();
      setNotice('资料已保存，并已同步到统一账号。');
    } catch {setNotice('资料已保存，但统一账号同步失败，请稍后重新保存。');}
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {await sync(await updateHackadminProfile(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])) as typeof form));}
    catch (cause) {setError(cause instanceof Error ? cause.message : '保存资料失败');}
    finally {setBusy(false);}
  }
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024) {setError('头像需要为不超过 5 MB 的 JPG 或 PNG 图片'); return;}
    setBusy(true); setError(''); setNotice('');
    try {await sync(await uploadHackadminAvatar(file));}
    catch (cause) {setError(cause instanceof Error ? cause.message : '上传头像失败');}
    finally {setBusy(false);}
  }
  return <div className={styles.profile}>
    <section className={styles.identity}><div className={styles.avatar}>{user.avatar_url ? <img src={avatarURL(user.avatar_url)} alt="个人头像" /> : <UserRound size={32} />}</div><h2>{user.nickname}</h2><p>{user.email}</p><button className={styles.secondary} disabled={busy} onClick={() => fileRef.current?.click()}><ImagePlus size={16} />上传头像</button><input ref={fileRef} type="file" accept="image/jpeg,image/png" hidden onChange={upload} aria-label="头像文件" /></section>
    <form className={styles.form} onSubmit={save}>
      <label>昵称<input required maxLength={40} value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} /></label>
      <label>邮箱地址<input readOnly value={user.email} /></label>
      <div className={styles.formRow}><label>所在城市<input maxLength={80} value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></label><label>GitHub 用户名<input maxLength={39} value={form.github_username} onChange={e => setForm({...form, github_username: e.target.value})} /></label></div>
      <label>个人网站<input type="url" maxLength={300} value={form.website_url} onChange={e => setForm({...form, website_url: e.target.value})} /></label>
      {notice && <p role="status" className={styles.notice}>{notice}</p>}{error && <p role="alert" className={`${styles.notice} ${styles.error}`}>{error}</p>}
      <div className={styles.actions}><button className={styles.primary} disabled={busy || !form.nickname.trim()} type="submit">{busy ? <LoaderCircle size={16} className={styles.spin} /> : <Save size={16} />}保存资料</button></div>
    </form>
  </div>;
}

export default function ProfilePage() {
  return <AccountShell title="个人资料">{(user, updateUser) => <ProfileForm user={user} updateUser={updateUser} />}</AccountShell>;
}
