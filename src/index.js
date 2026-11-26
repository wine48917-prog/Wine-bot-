// Persistent Node.js process for the WINE BOT dashboard and WhatsApp socket.
'use strict';
require('dotenv').config();
const express=require('express');
const path=require('node:path');
const crypto=require('node:crypto');
const {startWhatsApp,getPublicStatus,requestPairingCode,disconnectWhatsApp}=require('./whatsapp');
const app=express();
const PORT=Number(process.env.PORT||3000);
const ADMIN_TOKEN=process.env.ADMIN_TOKEN;
const DEVELOPER_NUMBER=String(process.env.DEVELOPER_NUMBER||'').replace(/\D/g,'');
const allowedOrigins=String(process.env.WEB_ORIGIN||'https://wine-bot-github.vercel.app').split(',').map(x=>x.trim()).filter(Boolean);
if(!ADMIN_TOKEN||ADMIN_TOKEN.length<24){console.error('ADMIN_TOKEN is required (24+ chars).');process.exit(1);}
app.disable('x-powered-by');
app.use((req,res,next)=>{
 const origin=req.get('origin');
 if(origin&&(allowedOrigins.includes(origin)||/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))){
  res.setHeader('Access-Control-Allow-Origin',origin);
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
 }
 if(req.method==='OPTIONS')return res.sendStatus(204);
 next();
});
app.use(express.json({limit:'32kb'}));
app.use(express.static(path.join(__dirname,'..','public'),{index:'index.html'}));
function requireAdmin(req,res,next){
 const value=String(req.get('authorization')||'').replace(/^Bearer\s+/i,'');
 const a=Buffer.from(value),b=Buffer.from(ADMIN_TOKEN);
 if(!value||a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(401).json({error:'غير مصرح. راجع رمز الإدارة.'});
 next();
}
app.get('/api/health',(_req,res)=>res.json({ok:true,service:'WINE BOT'}));
app.get('/api/status',requireAdmin,(_req,res)=>res.json(getPublicStatus()));
app.post('/api/pair',requireAdmin,async(req,res)=>{
 try{
  const phone=String(req.body?.phone||'').replace(/\D/g,'');
  if(!/^\d{10,15}$/.test(phone))return res.status(400).json({error:'اكتب رقم واتساب بمفتاح الدولة بدون +.'});
  const code=await requestPairingCode(phone);
  res.json({ok:true,code});
 }catch(e){res.status(409).json({error:e.message||'تعذر إنشاء رمز الربط.'});}
});
app.post('/api/disconnect',requireAdmin,async(_req,res)=>{
 try{await disconnectWhatsApp();res.json({ok:true});}
 catch(e){res.status(500).json({error:e.message||'تعذر فصل الجلسة.'});}
});
app.listen(PORT,'0.0.0.0',()=>{
 console.log('WINE BOT listening on '+PORT);
 startWhatsApp({developerNumber:DEVELOPER_NUMBER,prefix:process.env.BOT_PREFIX||'.'}).catch(e=>console.error('WhatsApp startup failed:',e.message));
});