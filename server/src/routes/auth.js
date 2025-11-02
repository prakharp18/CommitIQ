import express from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email,repo,read:org`
  res.redirect(githubAuthUrl)
})

router.get('/github/callback', async (req, res) => {
  const { code } = req.query

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/?error=no_code`)
  }

  try {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    }, {
      headers: { 'Accept': 'application/json' }
    })

    const { access_token } = tokenResponse.data

    if (!access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/?error=no_token`)
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const user = userResponse.data

    const jwtToken = jwt.sign({
      githubId: user.id,
      username: user.login,
      email: user.email,
      avatarUrl: user.avatar_url,
      accessToken: access_token
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${jwtToken}`)

  } catch (error) {
    console.error('GitHub OAuth error:', error.response?.data || error.message)
    res.redirect(`${process.env.FRONTEND_URL}/?error=oauth_failed`)
  }
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ user: decoded })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router