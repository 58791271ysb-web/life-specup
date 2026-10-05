# 인생 스펙업 v11.3 클라우드 최종 설정

이미 `schema.sql` 실행이 Success였다면 DB SQL은 다시 실행하지 않아도 됩니다.

## 1. Publishable key 넣기
`app/supabase-config.js`를 열고 `PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE`만 Supabase의 **Publishable key**로 교체하세요.
Project URL은 현재 프로젝트 주소로 이미 입력되어 있습니다.
Secret key / service_role key는 절대 넣지 마세요.

## 2. 이메일 확인 끄기 (필수)
Supabase Dashboard → Authentication → Sign In / Providers → Email에서 **Confirm email을 OFF**로 설정하세요.
인생 스펙업은 사용자 화면에서는 `아이디 + 비밀번호`만 사용하고, 내부적으로만 Supabase Auth와 연결합니다.

## 3. GitHub Pages 배포
ZIP 내용물을 저장소 루트에 덮어쓴 뒤 Commit → Push origin.
`index.html`이 저장소 루트에 있어야 합니다.

## 4. 최종 실기기 확인
- PC: 새 아이디 생성 → 캐릭터 생성 → 홈 진입
- PC: 공부 기록 1개 저장 → 로그아웃 → 같은 아이디 재로그인 → 기록 유지
- 모바일: 같은 아이디 로그인 → PC 기록 확인
- 모바일: 생년월일/입사일 연·월·일 터치 → 숫자 키패드 표시
- 모바일에서 기록 추가 → PC 새로고침/재로그인 → 기록 확인
