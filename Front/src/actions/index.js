/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/9/21
 * Description:
 */

export default {
    get: {
        articleList: {
            waiting: 'GET_ARTICLE_LIST_WAITING',
            successful: 'GET_ARTICLE_LIST_SUCCESSFUL',
            failed: 'GET_ARTICLE_LIST_FAILED'
        },
        article: {
            waiting: 'GET_ARCHIVES_WAITING',
            successful: 'GET_ARCHIVES_SUCCESSFUL',
            failed: 'GET_ARCHIVES_FAILED'
        },
        tags: {
            waiting: 'GET_ARCHIVES_WAITING',
            successful: 'GET_ARCHIVES_SUCCESSFUL',
            failed: 'GET_ARCHIVES_FAILED'
        },
        authors: {
            waiting: 'GET_ARCHIVES_WAITING',
            successful: 'GET_ARCHIVES_SUCCESSFUL',
            failed: 'GET_ARCHIVES_FAILED'
        }
    },
    change: {
        page: {
            articleList: 'CHANGE_PAGE_ARTICLE_LIST',
            tags: 'CHANGE_PAGE_TAGS',
            authors: 'CHANGE_PAGE_AUTHORS'
        },
        theme: 'CHANGE_THEME',
        headInfo: 'CHANGE_HEAD_INFO'
    }
};
