import axios from "axios";

const RESOURCE_URL = {
    base: {
        comment_session: "http://localhost:8080/api/v1",
        backoffice: "https://devapi.backoffice.monitalks.io/v1",
    },
    end_point: {
        authentication: "/auth",
        profile: "/customer/profile/trade/",
    },
    user_image_placeholder:
        "https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/userplaceholder_5734b83bd0.png",
};

const getCurrentUserInfo = async (backoffice_token: string, userId: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${backoffice_token}`;
    try {
        const response = await axios["get"](
            RESOURCE_URL.base.backoffice + RESOURCE_URL.end_point.profile + userId
        );
        return await Promise.resolve(response);
    } catch (e) {
        return await Promise.reject(e);
    }
};

const userAuthentication = async (user_id: string, user_email: string) => {
    try {
        const response = axios.post(
            RESOURCE_URL.base.comment_session + RESOURCE_URL.end_point.authentication,
            { user_id, user_email }
        );
        return await Promise.resolve(response);
    } catch (e) {
        return await Promise.reject(e);
    }
};

export const userSearchHandler = (slug: string) => {
    let payload = slug.replace("?q=", "").trim().split("+");
    if (!payload.length || payload.length !== 2) return;

    try {
        getCurrentUserInfo(payload[0], payload[1]).then((res) => {
            let user = res.data;
            if (!user.EmailAddress || !user.id) return;

            userAuthentication(user.id, user.EmailAddress).then((response) => {
                sessionStorage.setItem("token", response.data.token);
                sessionStorage.setItem("refreshToken", response.data.refreshToken);
            });
            const currentUser = {
                currentUserId: user.id,
                currentUserFullName: !!user.PostWithName
                    ? `${user.FirstName} ${user.MiddleName} ${user.LastName}`
                    : user.NickName,
                currentUserImg:
                    user.ProfilePicture?.length > 5
                        ? user.ProfilePicture
                        : RESOURCE_URL.user_image_placeholder,
            };
            let sessionUser = JSON.stringify(currentUser);
            sessionStorage.setItem("sessionUser", sessionUser);
        });
    } catch (e) {
        return console.log(e);
    }
};
