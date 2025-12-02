# Supabase 配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并登录
2. 创建新项目
3. 等待项目初始化完成

## 2. 获取 API 密钥

1. 在 Supabase 项目仪表板中，进入 **Settings** > **API**
2. 复制以下信息：
   - **Project URL** (例如: `https://xxxxx.supabase.co`)
   - **anon/public key** (anon key)

## 3. 配置环境变量

### 方法 1: 使用 .env 文件（推荐）

1. 在项目根目录创建 `.env` 文件：
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. 安装 dotenv（如果还没有）：
```bash
npm install dotenv
```

### 方法 2: 在 app.json 中配置

在 `app.json` 中添加：

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_project_url",
      "supabaseAnonKey": "your_supabase_anon_key"
    }
  }
}
```

## 4. 配置 Supabase 认证

### 启用 Email 认证

1. 在 Supabase 项目仪表板中，进入 **Authentication** > **Providers**
2. 确保 **Email** 提供商已启用
3. 配置邮箱模板（可选）

### 配置重定向 URL

1. 进入 **Authentication** > **URL Configuration**
2. 添加重定向 URL：
   - `bitbastion://` (用于移动端 OAuth 回调)
   - `bitbastion://reset-password` (用于密码重置)
   - `http://localhost:8081` (用于开发)

### 配置 OAuth 提供商（Google, Apple, Facebook）

#### Google OAuth

1. 进入 **Authentication** > **Providers** > **Google**
2. 启用 Google 提供商
3. 在 [Google Cloud Console](https://console.cloud.google.com/) 创建 OAuth 2.0 客户端：
   - 创建新项目或选择现有项目
   - 启用 Google+ API
   - 创建 OAuth 2.0 客户端 ID
   - 添加授权重定向 URI：`https://[your-project-ref].supabase.co/auth/v1/callback`
   - 复制 **Client ID** 和 **Client Secret**
4. 在 Supabase 中填入 Google Client ID 和 Client Secret

#### Apple OAuth

1. 进入 **Authentication** > **Providers** > **Apple**
2. 启用 Apple 提供商
3. 在 [Apple Developer Portal](https://developer.apple.com/) 配置：
   - 创建 App ID
   - 创建 Service ID
   - 配置重定向 URL
   - 获取 Team ID、Key ID 和 Private Key
4. 在 Supabase 中填入 Apple 配置信息

#### Facebook OAuth

1. 进入 **Authentication** > **Providers** > **Facebook**
2. 启用 Facebook 提供商
3. 在 [Facebook Developers](https://developers.facebook.com/) 创建应用：
   - 创建新应用
   - 添加 Facebook Login 产品
   - 配置 OAuth 重定向 URI：`https://[your-project-ref].supabase.co/auth/v1/callback`
   - 获取 App ID 和 App Secret
4. 在 Supabase 中填入 Facebook App ID 和 App Secret

## 5. 功能说明

### 已实现的功能

- ✅ 用户注册（Email + Password）
- ✅ 用户登录（Email + Password）
- ✅ 忘记密码（发送重置邮件）
- ✅ Google OAuth 登录
- ✅ Apple OAuth 登录
- ✅ Facebook OAuth 登录
- ✅ 表单验证
- ✅ 错误提示
- ✅ 加载状态
- ✅ 深度链接处理（OAuth 回调）

### 使用流程

1. **注册新用户**：
   - 切换到 "Signup" 模式
   - 输入邮箱和密码（至少 6 个字符）
   - 点击 "Sign Up"
   - 系统会发送验证邮件

2. **登录**：
   - 切换到 "Login" 模式
   - 输入已注册的邮箱和密码
   - 点击 "Sign In"

3. **忘记密码**：
   - 在登录模式下，点击 "Forgot Password?"
   - 输入邮箱地址
   - 系统会发送密码重置邮件

## 6. 测试

使用测试账号进行测试：

1. 在 Supabase 仪表板中，进入 **Authentication** > **Users**
2. 可以手动创建测试用户，或通过应用注册

## 7. 安全注意事项

- ⚠️ 不要将 `.env` 文件提交到 Git
- ⚠️ 使用 `anon key` 是安全的（它只能访问公开数据）
- ⚠️ 在生产环境中使用 Row Level Security (RLS) 策略保护数据

## 8. 故障排除

### 常见问题

1. **"Supabase URL or Anon Key is missing"**
   - 检查环境变量是否正确设置
   - 重启开发服务器

2. **登录失败**
   - 检查邮箱是否已验证
   - 确认密码是否正确
   - 查看 Supabase 日志获取详细错误信息

3. **密码重置邮件未收到**
   - 检查垃圾邮件文件夹
   - 确认 Supabase 邮箱配置正确
   - 检查重定向 URL 配置

