# 인생 스펙업 Cloud 연결 (1회 설정)
1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다.
3. Project Settings > API에서 Project URL과 Publishable key(또는 legacy anon key)를 복사합니다.
4. `app/supabase-config.js`의 두 값을 교체합니다.
5. GitHub에 다시 Push합니다.
6. Authentication > URL Configuration에서 Site URL을 `https://58791271ysb-web.github.io/life-specup/` 로 설정하고 Redirect URLs에 `https://58791271ysb-web.github.io/life-specup/app/login.html` 을 추가합니다.

중요: service_role 키는 절대로 HTML/JS/GitHub에 넣지 마세요.
