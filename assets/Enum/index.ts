import { PhysicsGroup } from "cc";


export enum INPUT_KEY_MENU {
    KEY_W = 'KEY_W',
    KEY_A = 'KEY_A',
    KEY_S = 'KEY_S',
    KEY_D = 'KEY_D',
}

// 方向枚举
export enum DIRECTION_STATE_ENUM {
    UP = 'hero_up',
    DOWN = 'hero_down',
    LEFT = 'hero_left',
    RIGHT = 'hero_right',
}

export enum ROLE_TYPE_ENUM {
    HERO = 'HERO',
    SKELETON_KING = 'SKELETON_KING'
}

export enum ROLE_PATH_ENUM {
    HERO = 'role/hero',
    SKELETON_KING = 'role/skeleton_king'
}

export enum ENTITY_STATE_ENUM {
    SURVIVAL = 'SURVIVAL',
    DEAD = 'DEAD'
}

export enum EVENT_TYPE_ENUM {
    DIALOG_RUNNING = 'DIALOG_RUNNING',
    DIALOG_FINISHED = 'DIALOG_FINISHED'
}
