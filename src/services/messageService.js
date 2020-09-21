import { app } from '@/main';

export default class MessageService {
    displayToast(title, type, msg, delay = 5000) {
        app.$bvToast.toast(msg, {
            title: title,
            autoHideDelay: delay,
            appendToast: true,
            variant: type,
            solid: true,
        });
    }
}
