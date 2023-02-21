import axios from 'axios';
import CryptoJS from 'crypto-js';


const RESOURCE_URL = {
  base: {
    comment_session: 'http://localhost:8080/api/v1',
    backoffice: 'https://testapi.backoffice.monitalks.io/v1',
  },
  end_point: {
    authentication: '/auth',
    profile: '/customer/profile/trade/',
  },
  user_image_placeholder:
    'https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/userplaceholder_5734b83bd0.png',
};

const decryptData = (data: any) => {

  let decryptedData: any;
  const key = 'bJjdu678330jjJHd99300000040400o5HHKbzrNELs8='
  try {
      decryptedData = JSON.parse(
          CryptoJS.enc.Utf8.stringify(
              CryptoJS.AES.decrypt(data.data, key, {
                  keySize: 128 / 8,
                  iv: data.key,
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7,
              }),
          ),
      );
  } catch (e) {
      console.warn('Unable to decrypt', e);
  }
  return decryptedData;
};

const getCurrentUserInfo = async (userId: string) => {
  axios.defaults.withCredentials = true;

  try {
    const result = await axios['get'](
      RESOURCE_URL.base.backoffice + RESOURCE_URL.end_point.profile + userId
    );
    return await Promise.resolve(result);
  } catch (e) {
    return await Promise.reject(e);
  }
};

const userAuthentication = async (payload: any) => {
  axios.defaults.withCredentials = false;

  try {
    const result = axios.post(
      RESOURCE_URL.base.comment_session + RESOURCE_URL.end_point.authentication,
      { payload }
    );
    return await Promise.resolve(result);
  } catch (e) {
    return await Promise.reject(e);
  }
};

export const userSearchHandler = (identifier: string) => {
  let payload = identifier.replace('?q=', '').trim().split('+');
  if (!payload.length || payload.length !== 2) {
    return window.alert('invalid identifier');
  }
  try {
    getCurrentUserInfo(payload[1]).then((response) => {
      const user = decryptData(response.data);
      if (!user.EmailAddress || !user.id) {
        return window.alert('invalid token');
      }

      const currentUser = {
        userId: user.id,
        fullName: !!user.PostWithName
          ? `${user.FirstName} ${user.MiddleName} ${user.LastName}`.trim()
          : user.NickName,
        avatar:
          user.ProfilePicture?.length > 5
            ? user.ProfilePicture
            : RESOURCE_URL.user_image_placeholder,
      };

      let sessionUser = JSON.stringify(currentUser);
      sessionStorage.setItem('sessionUser', sessionUser);

      const authPayload = {
        ...currentUser,
        userEmail: user.EmailAddress,
      };

      userAuthentication(authPayload).then((res) => {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('refreshToken', res.data.refreshToken);
      });
    });
  } catch (e) {
    axios.defaults.withCredentials = false;
    window.alert('invalid user credentials');
    return console.log(e, 'userSearchHandler');
  }
};
