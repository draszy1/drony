package com.drondemo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Created by draszy1 on 26.11.2016.
 */
@Data
@AllArgsConstructor
public class Dron {
    String id;
    PPoint position;
}
