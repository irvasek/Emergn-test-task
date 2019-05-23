package emergn.test.task.controller;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import emergn.test.task.model.Response;
import emergn.test.task.model.User;
import emergn.test.task.service.UserService;

@Controller
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    private boolean checkUserExist(final User user, final Response response) {
        if (userService.findByLogin(user.getLogin()) != null) {
            response.add("User " + user.getLogin() + " already exist");
            return false;
        }
        return true;
    }

    private boolean checkUserLogin(final User user, final Response response) {
        if (user.getLogin().length() < 6 || user.getLogin().length() > 20) {
            response.add("Invalid login " + user.getLogin());
            return false;
        }
        return true;
    }

    private boolean checkUserUsername(final User user, final Response response) {
        if (user.getUsername().length() < 6 || user.getUsername().length() > 20) {
            response.add("Invalid username " + user.getUsername() + " by user " + user.getLogin());
            return false;
        }
        return true;
    }

    private boolean checkUserEmail(final User user, final Response response) {
        final String emailValidationRegExp = "^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
        if (!user.getEmail().matches(emailValidationRegExp)) {
            response.add("Invalid email " + user.getEmail() + " by user {}" + user.getLogin());
            return false;
        }
        return true;
    }

    private boolean checkUserPassword(final User user, final Response response) {
        if (user.getPassword().length() < 8 || user.getPassword().length() > 20) {
            response.add("Invalid password " + user.getPassword() + " by user {}" + user.getLogin());
            return false;
        }
        return true;
    }

    private boolean checkUserPasswordConfirm(final User user, final Response response) {
        if (!user.getPassword().equals(user.getPasswordConfirm())) {
            response.add("Passwords do not match");
            return false;
        }
        return true;
    }

    @GetMapping(value = {"/users", "/"})
    public String users(final Model model, final Principal principal) {
        final User user = userService.findByLogin(principal.getName());
        model.addAttribute("login", user.getLogin());
        model.addAttribute("username", user.getUsername());
        model.addAttribute("email", user.getEmail());
        model.addAttribute("users", userService.findAll());
        return "users";
    }

    @GetMapping(value = "/login")
    public String signin(final Principal principal) {
        return "login";
    }

    @PostMapping(value = "/create")
    public @ResponseBody
    Response signup(@RequestBody final User user, final Model model) {
        final Response response = new Response();
        if (!(checkUserExist(user, response)
                & checkUserLogin(user, response)
                & checkUserUsername(user, response) & checkUserEmail(user, response)
                & checkUserPassword(user, response) & checkUserPasswordConfirm(user, response))) {
            response.setUser(user);
        } else {
            response.setUser(userService.create(user));
        }
        log.error(response.getMessage());
        return response;
    }

    @PutMapping(value = "/update")
    public @ResponseBody
    Response update(@RequestBody final User user, final Model model, final Principal principal) {
        final Response response = new Response();
        boolean isValidUserData = checkUserUsername(user, response) & checkUserEmail(user, response);
        if (!user.getPassword().isEmpty()) {
            isValidUserData = checkUserPassword(user, response) & checkUserPasswordConfirm(user, response) && isValidUserData;
        }
        if (!isValidUserData) {
            response.setUser(user);
        } else {
            response.setUser(userService.update(user, !user.getPassword().isEmpty()));
        }
        log.error(response.getMessage());
        return response;
    }
}
