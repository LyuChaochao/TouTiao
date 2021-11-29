import request from '@/utils/request'

// 用户登录
export const login = data => {
    return request({
        method: 'POST',
        url: 'v1_0/authorizations',
        data

    })
}

// 获取验证码
export const getSmsCode = mobile => {
    return request({
        method: 'GET',
        url: `/v1_0/sms/codes/${mobile}`
    })
}

// 获取用户信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: 'v1_0/user'
    })
}

// 获取用户频道
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: 'v1_0/user/channels'
    })
}

// 关注用户
export const addFollow = target => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target
        }
    })
}

// 取消关注用户
export const deleteFollow = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${target}`
    })
}


// 获取用户个人信息
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/profile'
    })
}

// 更新用户资料
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/profile',
        data
    })
}

// 更新用户头像
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/photo',
        data
    })
}