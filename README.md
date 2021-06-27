# let-me-check (ระบบเช็ค อิน เอ้าท์ ไทยชนะแบบอัตโนมัติบนแอพพลิเคชันไลน์)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

ระบบเช็ค อิน เอ้าท์ ไทยชนะแบบอัตโนมัติบนแอพพลิเคชันไลน์ ใช้งานง่ายบนแพลตฟอร์มไลน์
เพิ่มสถานที่เช็คได้สูงสุด 3 สถานที่(development mode) และเช็คอิน เอาท์แบบอัตโนมัติด้วย
Cronjob ที่มีบริการมาให้พร้อม

## Future features 🎊

- ทำงานร่วมกับ [Line beacon](https://developers.line.biz/en/docs/messaging-api/using-beacons) ให้เช็คอิน เอาท์ แบบเรียลไทม์ยิ่งขึ้น

## Features 🏐

- สามารถแสดงหน้าต่างการใช้งานเมื่อเปิดเข้าไฟล์ได้
- แชทบอทสำหรับสั่งเรียกใช้งานฟังก์ชันภายใน google app script เพื่อทำการค้นหาและแสดงสถานะงาน
- ค้นหาและเลือกดูข้อมูลบน LIFF (LINE FRONTEND FRAMEWORK) [Demo](https://script.google.com/macros/s/AKfycbxtBUEiPCrWkepUJm0cmXfhqoM0IZqcXEixvSFs/exec?v=project-list)
- ตัดข้อความที่จะส่งไปให้ไลน์อัตโนมัติถ้าข้อความเกิน 5,000 ตัวอักษร (5,000 ตัวอักษร / 1 buble)
- ระบบสามารถแสดงรายชื่อโครงการที่มีชื่อคล้ายกัน เมื่อ ผู้ใช้งานป้อนชื่อไม่ตรงในฐานข้อมูล

# Overall 🍚🍣 (ตัวอย่างภาพรวม)

### ตัวอย่างหน้าจอการใช้งาน LIFF

<img src="https://raw.githubusercontent.com/ggafiled/let-me-check-nuxt-js/main/static/img/reviews_0.jpg" alt="Let me check bot">

<img src="https://raw.githubusercontent.com/ggafiled/let-me-check-nuxt-js/main/static/img/reviews_1.jpg" alt="Let me check bot">

<img src="https://raw.githubusercontent.com/ggafiled/let-me-check-nuxt-js/main/static/img/reviews_2.jpg" alt="Let me check bot">

<img src="https://raw.githubusercontent.com/ggafiled/let-me-check-nuxt-js/main/static/img/reviews_3.jpg" alt="Let me check bot">

<img src="https://raw.githubusercontent.com/ggafiled/let-me-check-nuxt-js/main/static/img/reviews_4.jpg" alt="Let me check bot">

# Copyright 🏛

Copyright (c)Ggafiled (Nattapol Krobklang):See [LICENSE](https://github.com/ggafiled/let-me-check-nuxt-js/blob/master/LICENSE).
