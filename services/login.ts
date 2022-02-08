import ApiService from "./api";

export default class LoginService {
  public static async login(phoneNumber: string, code: string): Promise<void> {
    const { token } = await ApiService.post('user/login', { phoneNumber, code });
    await ApiService.setToken(token);
  }
  public static async logout(): Promise<void> {
    await ApiService.setToken(null).catch((error) => { throw error; });
  }

  public static async isLoggedin(): Promise<boolean> {
    const currentToken = await ApiService.getToken().catch((error) => { throw error; });
    return !!currentToken;
  }
}
