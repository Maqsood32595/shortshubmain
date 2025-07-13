<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShortsHub - Create, Schedule, and Publish Shorts Everywhere</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #e53e3e 0%, #9f7aea 50%, #bee3f8 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Development Notice */
        .dev-notice {
            background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%);
            color: white;
            padding: 15px 0;
            text-align: center;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .dev-notice p {
            margin: 0;
            font-size: 14px;
        }

        /* Header */
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px 0;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #e53e3e;
        }

        .tagline {
            font-size: 18px;
            color: #666;
            margin-top: 5px;
        }

        /* Hero Section */
        .hero {
            padding: 80px 0;
            text-align: center;
            color: white;
        }

        .hero h1 {
            font-size: 56px;
            margin-bottom: 20px;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero p {
            font-size: 22px;
            margin-bottom: 40px;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Login Form */
        .login-section {
            background: white;
            padding: 60px 0;
            margin-top: -40px;
            border-radius: 20px 20px 0 0;
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
        }

        .login-form {
            max-width: 400px;
            margin: 0 auto;
            padding: 40px;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .login-form h2 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
            font-size: 32px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }

        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .form-group input:focus {
            outline: none;
            border-color: #e53e3e;
        }

        .password-wrapper {
            position: relative;
        }

        .password-toggle {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #666;
        }

        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            font-size: 14px;
        }

        .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .forgot-password {
            color: #e53e3e;
            text-decoration: none;
        }

        .forgot-password:hover {
            text-decoration: underline;
        }

        .sign-in-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #e53e3e 0%, #9f7aea 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .sign-in-btn:hover {
            transform: translateY(-2px);
        }

        .divider {
            text-align: center;
            margin: 25px 0;
            color: #666;
            position: relative;
        }

        .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e1e5e9;
            z-index: 1;
        }

        .divider span {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 0 20px;
            position: relative;
            z-index: 2;
        }

        .google-btn {
            width: 100%;
            padding: 15px;
            background: white;
            color: #333;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .google-btn:hover {
            border-color: #e53e3e;
            background: #f8f9fa;
        }

        .signup-link {
            text-align: center;
            margin-top: 25px;
            color: #666;
        }

        .signup-link a {
            color: #e53e3e;
            text-decoration: none;
            font-weight: 600;
        }

        .signup-link a:hover {
            text-decoration: underline;
        }

        /* Features Section */
        .features {
            padding: 80px 0;
            background: white;
        }

        .features-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .features-header h2 {
            font-size: 48px;
            margin-bottom: 20px;
            color: #333;
        }

        .features-header p {
            font-size: 20px;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
            margin-top: 60px;
        }

        .feature-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            border: 1px solid #e9ecef;
        }

        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #e53e3e 0%, #9f7aea 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
        }

        .feature-card h3 {
            font-size: 28px;
            margin-bottom: 15px;
            color: #333;
        }

        .feature-card p {
            font-size: 18px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .feature-list {
            list-style: none;
            text-align: left;
        }

        .feature-list li {
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
            color: #555;
        }

        .feature-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #e53e3e;
            font-weight: bold;
        }

        /* CTA Section */
        .cta {
            background: #f8f9fa;
            padding: 80px 0;
            text-align: center;
        }

        .cta h2 {
            font-size: 36px;
            margin-bottom: 20px;
            color: #333;
        }

        .cta p {
            font-size: 18px;
            color: #666;
            margin-bottom: 40px;
        }

        .cta-btn {
            display: inline-block;
            padding: 20px 40px;
            background: linear-gradient(135deg, #b83358 0%, #8b4f8f 100%);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            transition: transform 0.3s;
        }

        .cta-btn:hover {
            transform: translateY(-3px);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 36px;
            }

            .hero p {
                font-size: 18px;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }

            .login-form {
                margin: 0 20px;
            }

            .features-header h2 {
                font-size: 32px;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="dev-notice">
        <div class="container">
            <p>🚧 Our web application is currently under development. We're working hard to bring you an exceptional experience. Thank you for your patience as we build something amazing!</p>
        </div>
    </div>

    <div class="header">
        <div class="container">
            <div class="header-content">
                <div>
                    <div class="logo">ShortsHub</div>
                    <div class="tagline">Create, schedule, and publish shorts everywhere</div>
                </div>
            </div>
        </div>
    </div>

    <div class="hero">
        <div class="container">
            <h1>Welcome back</h1>
            <p>Continue your journey to viral content creation and seamless social media management</p>
        </div>
    </div>

    <div class="login-section">
        <div class="container">
            <div class="login-form">
                <h2>Sign In</h2>
                <form>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-wrapper">
                            <input type="password" id="password" name="password" required>
                            <span class="password-toggle" onclick="togglePassword()">👁️</span>
                        </div>
                    </div>
                    <div class="form-options">
                        <label class="remember-me">
                            <input type="checkbox"> Remember me
                        </label>
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" class="sign-in-btn">Sign in</button>
                </form>
                <div class="divider">
                    <span>Or continue with</span>
                </div>
                <button class="google-btn">
                    <span>🔍</span> Continue with Google
                </button>
                <div class="signup-link">
                    Don't have an account? <a href="#">Sign up</a>
                </div>
            </div>
        </div>
    </div>

    <div class="features">
        <div class="container">
            <div class="features-header">
                <h2>Why Choose ShortsHub?</h2>
                <p>Everything you need to create, manage, and distribute engaging short-form content across all major social platforms</p>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🎬</div>
                    <h3>AI-Powered Content Creation</h3>
                    <p>Create stunning shorts with our advanced AI tools that help you generate ideas, write scripts, and optimize content for maximum engagement.</p>
                    <ul class="feature-list">
                        <li>Automated script generation</li>
                        <li>Smart thumbnail creation</li>
                        <li>Trending topic suggestions</li>
                        <li>Voice-over synthesis</li>
                    </ul>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">📅</div>
                    <h3>Smart Scheduling</h3>
                    <p>Never miss the perfect posting time with our intelligent scheduling system that analyzes your audience and optimizes posting times.</p>
                    <ul class="feature-list">
                        <li>Optimal timing analytics</li>
                        <li>Bulk scheduling options</li>
                        <li>Time zone management</li>
                        <li>Content calendar view</li>
                    </ul>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Multi-Platform Publishing</h3>
                    <p>Distribute your content simultaneously across TikTok, Instagram Reels, YouTube Shorts, and more with platform-specific optimizations.</p>
                    <ul class="feature-list">
                        <li>Cross-platform compatibility</li>
                        <li>Format auto-optimization</li>
                        <li>Platform-specific hashtags</li>
                        <li>Unified content management</li>
                    </ul>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Advanced Analytics</h3>
                    <p>Track performance across all platforms with detailed analytics and insights to understand what content resonates with your audience.</p>
                    <ul class="feature-list">
                        <li>Real-time performance metrics</li>
                        <li>Audience engagement analysis</li>
                        <li>Competitor benchmarking</li>
                        <li>ROI tracking</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="cta">
        <div class="container">
            <h2>Start Your Free Trial</h2>
            <p>Join thousands of creators who trust ShortsHub to amplify their content and grow their audience</p>
            <a href="#" class="cta-btn">Start Your Free Trial</a>
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const passwordToggle = document.querySelector('.password-toggle');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggle.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                passwordToggle.textContent = '👁️';
            }
        }

        // Add smooth scrolling for any anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add form validation
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Sign in functionality would be implemented here!');
        });
    </script>
</body>
</html>