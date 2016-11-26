package com.drondemo;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by draszy1 on 26.11.2016.
 */
@RestController
public class DronController {

    @RequestMapping("/getdrone")
    public Dron getdron() {
        return new Dron("S555", new PPoint(-16, -22));
    }
}
