export default class Acl {
    static canManagePools():boolean {
        return true;
    }

    static canStartPoll():boolean {
        return true;
        //app.forum.attribute('canStartPoll') || !app.session.user;
    }
}