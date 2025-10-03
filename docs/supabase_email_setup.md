# Supabase 이메일 인증 설정

현재 "Email not confirmed" 오류가 발생하는 이유는 Supabase에서 기본적으로 이메일 인증을 요구하기 때문입니다.

## 개발 환경에서 이메일 인증 비활성화 방법

### 1. Supabase Dashboard 접속
1. https://supabase.com 로그인
2. 프로젝트 선택

### 2. Authentication 설정 변경
1. 왼쪽 사이드바에서 **Authentication** 클릭
2. **Providers** 탭 클릭
3. **Email** 항목 클릭

### 3. 이메일 인증 비활성화
- **Confirm email** 옵션을 **OFF**로 변경
- 또는 **Enable email confirmations** 체크박스 해제
- **Save** 클릭

### 4. 기존 사용자 이메일 확인 처리 (선택사항)

이미 가입한 사용자의 이메일을 수동으로 확인 처리하려면:

1. 왼쪽 사이드바에서 **Authentication** > **Users** 클릭
2. 해당 사용자 클릭
3. **Email Confirmed At** 필드에 현재 시간 입력 또는
4. SQL Editor에서 다음 쿼리 실행:

```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'your-email@example.com';
```

## 프로덕션 환경 권장사항

프로덕션 환경에서는 보안을 위해 이메일 인증을 활성화하는 것을 권장합니다.

### SMTP 설정 (실제 이메일 발송)

1. **Authentication** > **Email Templates**
2. SMTP 설정 추가 (Gmail, SendGrid, AWS SES 등)
3. 이메일 템플릿 커스터마이징

### 이메일 템플릿 한글화

기본 영문 이메일을 한글로 변경:

```html
<h2>이메일 인증</h2>
<p>안녕하세요!</p>
<p>아래 링크를 클릭하여 이메일 인증을 완료해주세요:</p>
<p><a href="{{ .ConfirmationURL }}">이메일 인증하기</a></p>
```

## 현재 앱 동작

- 회원가입 → 성공 메시지 표시 → 1.5초 후 온보딩으로 이동
- 로그인 → 이메일 미인증 시 안내 메시지 표시
