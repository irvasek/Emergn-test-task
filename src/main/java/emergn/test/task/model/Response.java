package emergn.test.task.model;

public class Response {
    private User user;
    private String message = "";

    public void setUser(final User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public void setMessages(final String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void add(String message) {
        this.message += message + "; ";
    }
}
