import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

export function getOrSetUidToCookie() {
  let uid = Cookies.get('musoudle_uid');
  if (!uid) {
    uid = uuidv4();
    Cookies.set('musoudle_uid', uid, { expires: 365 }); // 1 year
  }
}