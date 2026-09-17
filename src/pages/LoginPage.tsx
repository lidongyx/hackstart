import {ArrowRight, KeyRound, ShieldCheck} from 'lucide-react';
import {loginURL} from '../lib/auth';

export default function LoginPage() {
  return <main className="login-page">
    <section className="login-intro">
      <a className="brand brand-light" href="https://hackstart.org/" rel="noreferrer"><img src="/hackstart.jpeg" alt="" /><span><strong>HackStart</strong><small>MEMBER SPACE</small></span></a>
      <div className="login-copy"><p className="eyebrow">A QUIETER PLACE TO LEARN</p><h1>把你的会员内容，<br /><em>放在一个地方。</em></h1><p>课程、会员权益和个人资料统一管理。登录后，会员站会自动识别你在 HackStart 的账号。</p></div>
      <div className="login-notes"><span><ShieldCheck size={17} />统一账号体系</span><span><KeyRound size={17} />令牌只保存在浏览器本地</span></div>
    </section>
    <section className="login-panel"><div className="login-panel-inner"><div className="login-mark"><img src="/hackstart-mark.png" alt="" /></div><p className="eyebrow dark">HACKSTART MEMBERS</p><h2>登录会员中心</h2><p className="muted">使用现有 HackStart 账号登录。新用户可以在登录页完成注册与邮箱验证。</p><a className="primary-button" href={loginURL('/')}><span>前往统一登录</span><ArrowRight size={16} /></a><a className="back-link" href="https://hackstart.org/" rel="noreferrer">返回 HackStart 首页</a></div></section>
  </main>;
}
