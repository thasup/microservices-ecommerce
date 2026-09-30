# Aurapan — สรุปการรีแฟกเตอร์ครั้งใหญ่ และแผนดีพลอยบน AWS

> เอกสารนี้อธิบายว่าเราเปลี่ยนอะไรไปบ้าง (PR #151), ถ้าดีพลอยบน AWS จริงจะเกิดอะไรขึ้น, ค่าใช้จ่ายเท่าไร และขั้นตอนที่คุณต้องทำต่อทีละข้อ
>
> **สถานะจริง ณ ตอนนี้:** โค้ดผ่าน CI ทั้ง 4 ชุดทดสอบ (user / product / order / payment) และ `next build` ผ่าน แต่ **ยังไม่เคยดีพลอยจริงบน AWS** และ Terraform **ยังไม่เคยรัน `terraform validate/apply`** (เครือข่ายของเครื่องที่ใช้ทำงานบล็อก Terraform registry) และ **ยังไม่ได้ build Docker image จริง** (ไม่มี Docker daemon) จุดเหล่านี้จะถูกพิสูจน์ครั้งแรกตอนคุณรันตามขั้นตอนด้านล่าง ดังนั้นควรเผื่อเวลาแก้ปัญหาหน้างานเล็กน้อยในการดีพลอยครั้งแรก

---

## 1. เราเปลี่ยนอะไรไปบ้าง

### 1.1 ความปลอดภัยและ dependency

| หัวข้อ | ก่อน | หลัง |
| --- | --- | --- |
| `npm audit` (5 service + client) | มีช่องโหว่หลายรายการ รวมระดับ high/critical | **0 ช่องโหว่** |
| jsonwebtoken | 8.x (CVE-2022-23529 และตระกูลเดียวกัน) | 9.x และบังคับด้วย npm `overrides` ให้แพ็กเกจ `@thasup-dev/common` ที่ยังใช้ v8 ใช้ v9 ด้วย |
| Node.js ใน Docker | Node 16 (หมดอายุ Sep 2023) | Node 22 LTS |
| Express / Mongoose | 4.17 / 6.2 | 4.21 / 8.16 |
| Stripe SDK (backend) | 8.x | 18.x |
| Swiper (client) | 8.x | 12.x (แก้ prototype pollution ระดับ critical) |
| Image production | รัน `ts-node`/`nodemon`, root user | คอมไพล์ TypeScript แล้ว, multi-stage, รันเป็น `USER node` |

รายละเอียดทั้งหมดและความเสี่ยงที่ยังเหลืออยู่ที่ `docs/SECURITY-AUDIT.md`

### 1.2 Next.js 12 → 15 (App Router เต็มรูปแบบ)

- ย้ายทุกหน้าจาก `pages/` ไป `app/` ใช้ server component ดึงข้อมูลเฉพาะที่หน้านั้นต้องใช้
- **แก้บั๊กด้านประสิทธิภาพตัวใหญ่:** ของเดิมมี `_app.getInitialProps` ที่ดึง *สินค้าทั้งหมด ผู้ใช้ทั้งหมด และออเดอร์ทั้งหมด* ทุกครั้งที่เปิดทุกหน้า ตอนนี้ไม่มีแล้ว
- เปลี่ยนไลบรารีที่เลิกพัฒนาไปแล้ว: `react-stripe-checkout` → `@stripe/react-stripe-js`, `react-paypal-button-v2` → `@paypal/react-paypal-js`, `react-rating-stars-component` → คอมโพเนนต์ในโปรเจกต์เอง
- ตรวจสิทธิ์ฝั่งเซิร์ฟเวอร์ด้วย `redirect()` (เช่น หน้า admin, checkout, dashboard)
- มี `/api/healthz` สำหรับ Kubernetes probe

### 1.3 โครงสร้างพื้นฐาน

- **Terraform (`infra/terraform/`)**: สร้าง EC2 เครื่องเดียวรัน k3s พร้อม ingress-nginx, cert-manager (HTTPS ฟรีจาก Let's Encrypt), secrets และ manifest ทั้งหมด
- **Kubernetes manifest**: ใส่ resource limit, liveness/readiness probe, securityContext แบบ non-root, ปักเวอร์ชัน image (`mongo:7`, `nats-streaming:0.25.6`), ให้ MongoDB ใช้ PersistentVolumeClaim
- **ทุก service** มี `/healthz`, มี `Dockerfile` (production) และ `dev.Dockerfile` (สำหรับ skaffold hot-reload)
- **Seed script (`scripts/seed.mjs`)**: สร้างแอดมิน + ลูกค้าตัวอย่าง 2 คน + สินค้า 10 ชิ้น *ผ่าน API จริง* เพื่อให้ข้อมูลสินค้าถูกส่งไปยัง order/payment service ผ่าน NATS เหมือนการใช้งานจริง
- **GitHub Actions**: อัปเดตเป็น Node 22, build image หลายสถาปัตยกรรม (amd64 + arm64), มีทางเลือกสั่ง rollout ผ่าน AWS SSM

### 1.4 บั๊กที่เจอระหว่างทาง (ซ่อมแล้ว)

- `.gitignore` เดิมซ่อนโฟลเดอร์ `infra/` ทั้งหมด จึงแก้เพื่อให้ไฟล์ Terraform ถูก commit ได้
- `Order.findByEvent` ใน payment service ค้นด้วย `id` แทน `_id` ซึ่ง Mongoose 6 เคยเมินให้เงียบ ๆ แต่ Mongoose 8 ไม่เมิน ทำให้ listener หาออเดอร์ไม่เจอ (CI จับได้ ซ่อมแล้ว)

---

## 2. ถ้าดีพลอยบน AWS จริง จะเกิดอะไรขึ้น

### 2.1 สถาปัตยกรรมที่จะได้

```
อินเทอร์เน็ต ──> Public IPv4 (Elastic IP) ──> EC2 t4g.small (Ubuntu 24.04, ARM)
                                               └─ k3s (ปิด traefik)
                                                   ├─ ingress-nginx  (bind พอร์ต 80/443 ตรงบนเครื่อง ไม่ใช้ Load Balancer)
                                                   ├─ cert-manager   (ออกใบรับรอง HTTPS อัตโนมัติ)
                                                   ├─ client, user, product, order, payment, expiration
                                                   ├─ NATS Streaming + Redis (ในเครื่อง)
                                                   └─ MongoDB: Atlas M0 (แนะนำ) หรือรันในเครื่อง
```

### 2.2 ลำดับเหตุการณ์หลังสั่ง `terraform apply`

1. Terraform สร้าง EC2, Elastic IP, Security Group (เปิดแค่ 80/443), IAM role สำหรับ SSM
2. ตอนบูตครั้งแรก `user_data` ติดตั้ง k3s → ingress-nginx → cert-manager → สร้าง Kubernetes Secrets จากค่าใน `terraform.tfvars` → clone repo → apply manifest (ใช้เวลาราว 5–10 นาที)
3. คุณตั้ง DNS A record ชี้โดเมนมาที่ IP ที่ Terraform แสดง
4. cert-manager ขอใบรับรอง Let's Encrypt ให้เอง เมื่อ DNS ชี้ถูกต้อง (มักใช้เวลา 2–10 นาที) แล้วเว็บจะเปิดผ่าน `https://โดเมนของคุณ`
5. รัน seed script เพื่อใส่สินค้าและผู้ใช้ตัวอย่าง

### 2.3 สิ่งที่ควรรู้ให้ชัดก่อนเริ่ม (ข้อจำกัดจริง)

| เรื่อง | รายละเอียด |
| --- | --- |
| **เครื่องเดียว = จุดล้มเหลวเดียว** | ถ้าเครื่องล่ม เว็บล่ม (ออกแบบมาเพื่อประหยัด) Terraform สร้างเครื่องใหม่ได้ใน 5–10 นาที ข้อมูลที่อยู่ใน Atlas ไม่หาย แต่ข้อมูล MongoDB ในเครื่องผูกกับดิสก์ของเครื่องนั้น |
| **RAM** | manifest ขอ memory รวม 1,152 Mi (แอป) + 1,024 Mi (Mongo 4 ตัว) ซึ่ง **ไม่พอบน `t4g.small` (2 GiB)** ถ้าใช้ Mongo ในเครื่อง (บาง pod จะค้างสถานะ `Pending`) ตัวเลขนี้คำนวณจากไฟล์ manifest ยังไม่เคยทดสอบโหลดจริง |
| **`t4g.micro` ใช้ไม่ได้** | 1 GiB น้อยเกินไปสำหรับ manifest ชุดปัจจุบัน (ต่างจากที่เอกสารรุ่นแรกเคยเขียนไว้ ซึ่งผิด และแก้แล้ว) |
| **NATS Streaming หมดอายุ (EOL)** | ยังใช้อยู่ แต่เข้าถึงได้เฉพาะในคลัสเตอร์ ควรย้ายไป JetStream ในอนาคต (งานแยก) |
| **`@thasup-dev/common`** | แพ็กเกจที่คุณเป็นเจ้าของยังมี dependency เก่า ช่องโหว่ jwt ในนั้นถูกกันไว้ด้วย overrides แต่ควรเผยแพร่เวอร์ชันใหม่ |
| **Stripe** | ยังใช้ flow แบบ token + Charges API (เก่า) ยังใช้ได้กับบัญชีเดิม แต่บัญชีใหม่ Stripe อาจบังคับให้ย้ายไป PaymentIntents |
| **ไม่มี backup อัตโนมัติ** | ถ้าใช้ Atlas M0 ฟรี จะไม่มี backup ต่อเนื่อง ควรตั้ง export เป็นระยะถ้าธุรกิจเริ่มมีออเดอร์จริง |

---

## 3. ค่าใช้จ่ายรายเดือน (us-east-1, on-demand)

> ราคาอ้างอิงตามที่ทราบ ณ ปี 2026 โปรดตรวจสอบราคาล่าสุดในหน้า AWS Pricing ก่อนตัดสินใจ

| รายการ | ทางเลือก A: `t4g.small` + Atlas M0 (**แนะนำ**) | ทางเลือก B: `t4g.medium` + Mongo ในเครื่อง |
| --- | --- | --- |
| EC2 (ARM) | ~$12.26 (2 vCPU, 2 GiB) | ~$24.53 (2 vCPU, 4 GiB) |
| ดิสก์ EBS gp3 20 GB | ~$1.60 | ~$1.60 |
| Public IPv4 / Elastic IP | ~$3.65 | ~$3.65 |
| Data transfer ขาออก (ร้านเล็ก) | ~$0–1 | ~$0–1 |
| Route 53 (ไม่บังคับ ใช้ DNS ที่อื่นได้) | $0.50 | $0.50 |
| MongoDB Atlas M0 | $0 | ไม่ใช้ |
| **รวมต่อเดือน** | **≈ $18–19 (~฿650–700)** | **≈ $31 (~฿1,100)** |

**เทียบกับเดิม (DigitalOcean ~$30/เดือน):**

- ทางเลือก A ถูกกว่าประมาณ 40%
- ทางเลือก B ราคาใกล้เคียงของเดิม (ข้อดีคือทุกอย่างอยู่ในเครื่องเดียว ข้อเสียคือไม่ถูกลง)

**ค่าใช้จ่ายอื่นที่ไม่รวมในตาราง:**

- ชื่อโดเมน (~$10–15/ปี ตามผู้จดทะเบียน)
- ค่าธรรมเนียม Stripe/PayPal ต่อธุรกรรม (ไม่ใช่ค่าโครงสร้างพื้นฐาน)
- ลดต้นทุนเพิ่มได้ด้วย EC2 Savings Plan แบบ 1 ปี (ลดค่า EC2 ได้ราว 30%) เมื่อมั่นใจว่าจะรันต่อเนื่อง
- ตั้ง **AWS Budgets** แจ้งเตือนที่ ~$25/เดือน กันบิลเกินคาด

**ที่เราตั้งใจเลี่ยง:** EKS control plane ($73/เดือน), NAT Gateway (~$32/เดือน + ค่าข้อมูล), ALB/NLB (~$16/เดือน)

> หมายเหตุเรื่องการแก้ตัวเลข: ตอนเปิด PR ผมเคยระบุว่า ~$15/เดือน และว่า Elastic IP ฟรีขณะผูกกับเครื่อง ซึ่งไม่ถูกต้องแล้ว เพราะ AWS คิดค่า public IPv4 ทุกตัวตั้งแต่ก.พ. 2024 จึงแก้ตัวเลขทั้งใน README, `docs/` และ `infra/terraform/README.md` ให้ตรงกับตารางนี้แล้ว

---

## 4. ขั้นตอนที่คุณต้องทำต่อ (ทีละข้อ)

### ระยะที่ 0 — ตรวจ PR และ merge

1. ตรวจ PR #151 (`https://github.com/thasup/microservices-ecommerce/pull/151`) แล้ว merge เข้า `main` เมื่อพอใจ
2. ตั้งค่า GitHub Secrets (Settings → Secrets and variables → Actions):
   - `DOCKER_USERNAME`, `DOCKER_PASSWORD` (สำหรับ push image ไป Docker Hub)
   - `STRIPE_KEY` (secret key แบบ `sk_test_...` สำหรับชุดทดสอบ payment)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `NEXT_PUBLIC_GA_ID` (ค่าเหล่านี้ถูกฝังตอน build ฝั่ง client)
3. หลัง merge workflow `deploy-*` จะ build และ push image (`thasup/user`, `thasup/client` ฯลฯ) ขึ้น Docker Hub ให้ ตรวจว่าทุก workflow ผ่านและ image มีทั้ง amd64 + arm64

> ถ้าใช้ Docker Hub namespace อื่นที่ไม่ใช่ `thasup` ให้ตั้ง `docker_registry` ใน Terraform ให้ตรงกัน

### ระยะที่ 1 — ทดลองในเครื่องก่อน (ฟรี แนะนำมาก)

ทำเพื่อพิสูจน์ว่าโค้ดทั้งหมดทำงานจริงก่อนจ่ายเงินให้ AWS (ขั้นตอนเต็มใน `docs/DEPLOYMENT.md`)

1. เปิด Kubernetes ใน Docker Desktop, ติดตั้ง Skaffold, kubectl
2. `kubectl config use-context docker-desktop`
3. ติดตั้ง ingress-nginx (คำสั่งอยู่ใน `docs/DEPLOYMENT.md`)
4. เพิ่ม `127.0.0.1 aurapan.local` ในไฟล์ hosts
5. สร้าง Kubernetes secrets (คำสั่งอยู่ใน README)
6. `skaffold dev` แล้วเปิด `http://aurapan.local`
7. `kubectl port-forward svc/user-mongo-srv 27018:27017` แล้วรัน `cd scripts && npm install && npm run seed`
8. ทดสอบล็อกอินด้วย `admin@aurapan.com` / `password123`, ซื้อสินค้าด้วยบัตรทดสอบ Stripe `4242 4242 4242 4242`

ถ้าขั้นตอนนี้เจอปัญหา (เช่น image build ไม่ผ่าน) ให้แก้ก่อนไป AWS เพราะเป็นครั้งแรกที่ image ถูก build จริงในเครื่องคุณ

### ระยะที่ 2 — เตรียมบริการภายนอก

1. **AWS account**: ตั้ง MFA ให้ root, สร้าง IAM user/role สำหรับ Terraform (ไม่ควรใช้ root key), ติดตั้ง AWS CLI แล้ว `aws configure`
2. **AWS Budgets**: ตั้งการแจ้งเตือนงบ (~$25/เดือน)
3. **MongoDB Atlas (ทางเลือก A)**: สร้างคลัสเตอร์ M0 ฟรี, สร้าง database 4 ชุด (users / products / orders / payments) หรือใช้ 4 connection string ที่ชี้ database ต่างชื่อ, สร้าง DB user, ใน Network Access อนุญาต IP ของเครื่อง EC2 (จะได้ IP หลังรัน Terraform รอบแรก ดูระยะที่ 3 ข้อ 6)
4. **Stripe / PayPal**: ใช้คีย์โหมดทดสอบก่อน ยังไม่ต้องสลับเป็น live
5. **โดเมน**: ซื้อโดเมน และเตรียมเข้าไปแก้ DNS ได้

### ระยะที่ 3 — ดีพลอยด้วย Terraform

1. ติดตั้ง Terraform >= 1.5
2. `cd infra/terraform && cp terraform.tfvars.example terraform.tfvars`
3. แก้ `terraform.tfvars`:
   - `domain`, `acme_email`
   - `jwt_key` (สร้างด้วย `openssl rand -hex 32`), `stripe_key`, `paypal_client_id`
   - **ทางเลือก A (แนะนำ):** คง `instance_type = "t4g.small"`, ตั้ง `use_in_cluster_databases = false`, ใส่ `mongo_uri_*` ทั้ง 4 ตัวจาก Atlas
   - **ทางเลือก B:** ตั้ง `instance_type = "t4g.medium"` และปล่อย `use_in_cluster_databases = true`
4. `terraform init` → `terraform plan` (อ่านผลให้ละเอียด) → `terraform apply`
5. **ครั้งแรกอาจมี error จริง** เพราะ Terraform ชุดนี้ยังไม่เคยถูก validate กับ provider จริง ถ้าเจอ error ให้ส่งข้อความมาให้ผมช่วยแก้
6. คัดลอก `public_ip` จาก output → (ถ้าใช้ Atlas) ไปเพิ่ม IP นี้ใน Atlas Network Access
7. ตั้ง DNS A record ให้โดเมนชี้ไปที่ `public_ip`
8. ดูความคืบหน้าการบูต:
   ```sh
   aws ssm start-session --target <instance_id>
   sudo tail -f /var/log/user-data.log
   ```
9. รอให้ pod ทุกตัว `Running`: `sudo kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get pods -A`

### ระยะที่ 4 — Seed ข้อมูลและตรวจสอบ

1. รัน seed ให้ชี้ไปที่โดเมนจริง (`API_URL=https://โดเมนของคุณ`) ต้องเข้าถึง MongoDB ของ user service เพื่อตั้งสิทธิ์แอดมิน ดูวิธีใน `docs/DEPLOYMENT.md` และ `scripts/README.md` ถ้าใช้ Atlas ให้ตั้ง `MONGO_URI_USER` เป็น URI ของ Atlas ได้เลย
2. เช็คลิสต์ตรวจรับ:
   - หน้าแรกโหลดผ่าน HTTPS มีรูปสินค้า
   - สมัครสมาชิก / ล็อกอิน / ออกจากระบบได้
   - เพิ่มสินค้าลงตะกร้า → checkout → จ่ายด้วย Stripe test card ได้
   - หน้า admin จัดการสินค้า/ผู้ใช้/ออเดอร์ได้
   - ออเดอร์ที่ไม่จ่ายหมดอายุเอง (ทดสอบ expiration service)
3. **เปลี่ยนรหัสผ่านแอดมินทันที** อย่าปล่อย `password123` บนเว็บจริง (ตั้ง `SEED_ADMIN_PASSWORD` ตอนรัน seed หรือเปลี่ยนในหน้าโปรไฟล์)

### ระยะที่ 5 — ก่อนเปิดขายจริง

1. สลับ Stripe/PayPal เป็น live key (อัปเดต `terraform.tfvars` แล้ว apply, และ rebuild image client เพราะ `NEXT_PUBLIC_*` ถูกฝังตอน build)
2. ตั้ง backup MongoDB (Atlas M0 ไม่มี continuous backup ควร export เป็นระยะ หรืออัปเกรดเป็นแผนที่มี backup)
3. ตั้ง monitoring/แจ้งเตือนอย่างน้อยระดับ uptime check ภายนอก
4. (ไม่บังคับ) ตั้ง GitHub repo variables `AWS_REGION` + `AURAPAN_INSTANCE_ID` และ secrets ของ AWS เพื่อให้ push เข้า `main` แล้ว rollout อัตโนมัติผ่าน SSM (ใช้ IAM user สิทธิ์แคบ เฉพาะ `ssm:SendCommand`)
5. ตั้ง Dependabot/Renovate เพื่อให้ dependency ไม่เก่าอีก

### ระยะที่ 6 — งานต่อยอดที่แนะนำ (เรียงตามความคุ้ม)

1. เผยแพร่ `@thasup-dev/common` เวอร์ชันใหม่ที่อัปเดต dependency แล้วเลิกพึ่ง overrides
2. ย้าย NATS Streaming → JetStream
3. ย้าย Stripe จาก Charges API → PaymentIntents
4. ถ้ายอดขายโต: ย้าย MongoDB ไปแผนที่มี backup และแยกเครื่อง/เพิ่ม node

---

## 5. ยกเลิก / ลบทั้งหมด

```sh
cd infra/terraform
terraform destroy
```

จะลบ EC2, Elastic IP, ดิสก์, Security Group และ IAM role (ข้อมูล MongoDB ที่อยู่ในเครื่องจะหายพร้อมดิสก์ ข้อมูลใน Atlas ไม่ถูกลบ ต้องลบเองที่ Atlas) หลัง destroy ค่าใช้จ่ายของ AWS ส่วนนี้จะหยุดคิด

---

## 6. ตารางสรุปสั้น

| คำถาม | คำตอบ |
| --- | --- |
| เว็บใช้งานได้จริงไหม? | โค้ดผ่าน CI และ build แต่ยังไม่เคยรันครบวงจรบน cluster จริง ต้องพิสูจน์ในระยะที่ 1 และ 3 |
| ค่าใช้จ่ายต่ำสุดที่ใช้งานได้? | ≈ **$18–19/เดือน** (`t4g.small` + Atlas M0) |
| ถ้าอยากให้ทุกอย่างอยู่ในเครื่องเดียว? | ≈ **$31/เดือน** (`t4g.medium`) เท่ากับ DigitalOcean เดิม |
| ความเสี่ยงหลัก? | เครื่องเดียว, Atlas M0 ไม่มี backup, NATS Streaming EOL, Terraform ยังไม่เคยรันจริง |
| ต้องทำอะไรก่อนเป็นอย่างแรก? | Merge PR → ตั้ง GitHub Secrets → ทดลองในเครื่องด้วย `skaffold dev` |

เอกสารประกอบ: `docs/DEPLOYMENT.md`, `docs/SECURITY-AUDIT.md`, `infra/terraform/README.md`, `scripts/README.md`
