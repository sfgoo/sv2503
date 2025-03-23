import { createHmac, createHash } from 'crypto';

console.log('Running telegram-hash.js with ID: 789123456');

// Проверочный пример
const checkBotToken = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
const checkSecretKey = createHash('sha256').update(checkBotToken).digest();
const checkData = 'auth_date=1715193383\nfirst_name=John\nid=123456789\nusername=john_doe';
console.log('Check data raw:', JSON.stringify(checkData));
console.log('Check data length:', checkData.length);
console.log('Check data bytes:', Buffer.from(checkData, 'utf8').toString('hex'));
const checkHash = createHmac('sha256', checkSecretKey).update(checkData).digest('hex');
console.log('Check hash (expected: e52c92daf8e2d164a27fd1e179e26eadd829a7d860e2e56d2f47eb77d3f43a68):', checkHash);

// Ваши данные
const botToken = '8194887035:AAGkhsjzdgeqi6Y2l4v3h6cmayGaIRMlciY';
const secretKey = createHash('sha256').update(botToken).digest();
const data = 'auth_date=1742735663\nfirst_name=O\nid=891940\nlast_name=W\nphoto_url=https://t.me/i/userpic/320/xUJHfqGgraKabjtW3fwxVf_ID_-jArhHT9Z_0g0HXmo.jpg\nusername=waple';
console.log('Your data raw:', JSON.stringify(data));
console.log('Your data length:', data.length);
console.log('Your data bytes:', Buffer.from(data, 'utf8').toString('hex'));
const hash = createHmac('sha256', secretKey).update(data).digest('hex');
console.log('Your hash (expected: 2fbb1fdfab4560d2ea24d842163c870ccae901aec9aa94084ab046f6a64f8c1d):', hash);