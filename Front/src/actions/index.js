/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

export default {
    get: {
        archives: {
            waiting: 'GET_ARCHIVES_WAITING',
            successful: 'GET_ARCHIVES_SUCCESSFUL',
            failed: 'GET_ARCHIVES_FAILED'
        },
        author: {
            waiting: 'GET_AUTHOR_WAITING',
            successful: 'GET_AUTHOR_SUCCESSFUL',
            failed: 'GET_AUTHOR_FAILED'
        },
        tag: {
            waiting: 'GET_TAG_WAITING',
            successful: 'GET_TAG_SUCCESSFUL',
            failed: 'GET_TAG_FAILED'
        },
        category: {
            waiting: 'GET_CATEGORY_WAITING',
            successful: 'GET_CATEGORY_SUCCESSFUL',
            failed: 'GET_CATEGORY_FAILED'
        },
        article: {
            waiting: 'GET_ARTICLE_WAITING',
            successful: 'GET_ARTICLE_SUCCESSFUL',
            failed: 'GET_ARTICLE_FAILED'
        },
        tags: {
            waiting: 'GET_TAGS_WAITING',
            successful: 'GET_TAGS_SUCCESSFUL',
            failed: 'GET_TAGS_FAILED'
        },
        authors: {
            waiting: 'GET_AUTHORS_WAITING',
            successful: 'GET_AUTHORS_SUCCESSFUL',
            failed: 'GET_AUTHORS_FAILED'
        }
    },
    init: {
        theme: 'INIT_THEME',
        music: {
            successful: 'INIT_MUSIC_SUCCESSFUL',
            failed: 'INIT_MUSIC_FAILED'
        },
        all: {
            successful: 'INIT_ALL_SUCCESSFUL',
            failed: 'INIT_ALL_FAILED'
        }
    },
    reset: {
        state: {
            all: 'RESET_STATE_ALL'
        }
    },
    change: {
        page: {
            archives: 'CHANGE_PAGE_ARCHIVES',
            author: 'CHANGE_PAGE_AUTHOR',
            tag: 'CHANGE_PAGE_TAG',
            category: 'CHANGE_PAGE_CATEGORY',
            tags: 'CHANGE_PAGE_TAGS',
            authors: 'CHANGE_PAGE_AUTHORS'
        },
        theme: {
            current: 'CHANGE_THEME_CURRENT',
            default: 'CHANGE_THEME_DEFAULT'
        },
        headInfo: 'CHANGE_HEAD_INFO',
        music: {
            default: 'CHANGE_MUSIC_DEFAULT',
            current: 'CHANGE_MUSIC_CURRENT'
        }
    }
};
