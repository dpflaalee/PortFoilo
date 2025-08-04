import shortId from 'shortid';  //##
import produce from 'immer';
import { faker } from '@faker-js/faker';
faker.seed(123);

///////////////////////////////////////////////////////////////////////
export const LOAD_NOTIFICATION_REQUEST = 'LOAD_NOTIFICATION_REQUEST';
export const LOAD_NOTIFICATION_SUCCESS = 'LOAD_NOTIFICATION_SUCCESS';
export const LOAD_NOTIFICATION_FAILURE = 'LOAD_NOTIFICATION_FAILURE';

export const READ_ALL_NOTIFICATION_REQUEST = 'READ_ALL_NOTIFICATION_REQUEST';
export const READ_ALL_NOTIFICATION_SUCCESS = 'READ_ALL_NOTIFICATION_SUCCESS';
export const READ_ALL_NOTIFICATION_FAILURE = 'READ_ALL_NOTIFICATION_FAILURE';

export const ADD_NOTIFICATION_REQUEST = 'ADD_NOTIFICATION_REQUEST';
export const ADD_NOTIFICATION_SUCCESS = 'ADD_NOTIFICATION_SUCCESS';
export const ADD_NOTIFICATION_FAILURE = 'ADD_NOTIFICATION_FAILURE';

export const REMOVE_NOTIFICATION_REQUEST = 'REMOVE_NOTIFICATION_REQUEST';
export const REMOVE_NOTIFICATION_SUCCESS = 'REMOVE_NOTIFICATION_SUCCESS';
export const REMOVE_NOTIFICATION_FAILURE = 'REMOVE_NOTIFICATION_FAILURE';
///////////////////////////////////////////////////////////////////////

export const initialState = {
    loadNotificationLoading: false,
    loadNotificationDone: false,
    loadNotificationError: null,

    readNotificationLoading: false,
    readNotificationDone: false,
    readNotificationErorr: null,

    addNotificationLoading: false,
    addNotificationDone: false,
    addNotificationError: null,

    removeNotificationLoading: false,
    removeNotificationDone: false,
    removeNotificationError: null,

    mainNotification: [],
    hasNewNotification: false,
};

//////////////////////////////////////////

const reducer = (state = initialState, action) => produce(state, (draft) => {
    switch (action.type) {
        //////////////////////////////
        case LOAD_NOTIFICATION_REQUEST:
            draft.loadNotificationLoading = true;
            draft.loadNotificationDone = false;
            draft.loadNotificationError = null;
            break;

        case LOAD_NOTIFICATION_SUCCESS:
            draft.loadNotificationLoading = false;
            draft.loadNotificationDone = true;
            draft.loadNotificationError = null;
            draft.mainNotification = action.data;
            draft.hasNewNotification = action.data.some(noti => !noti.isRead);
            break;

        case LOAD_NOTIFICATION_FAILURE:
            draft.loadNotificationLoading = false;
            draft.loadNotificationDone = false;
            draft.loadNotificationError = action.error;
            console.log('🚨 notificationReducer :  ', action.error);
            break;

        ///////////////////////////////////////
        case READ_ALL_NOTIFICATION_REQUEST:
            draft.readNotificationLoading = true;
            draft.readNotificationDone = false;
            draft.readNotificationErorr = null;
            break;

        case READ_ALL_NOTIFICATION_SUCCESS:
            draft.mainNotification = draft.mainNotification.map((n) => ({
                ...n,
                isRead: true,
            }));
            break;

        case READ_ALL_NOTIFICATION_FAILURE:
            draft.readNotificationLoading = false;
            draft.readNotificationDone = false;
            draft.readNotificationErorr = action.error
            console.log('🚨 notificationReducer :  ', action.error);
            break;

        ///////////////////////////////////////
        case ADD_NOTIFICATION_REQUEST:
            draft.addNotificationLoading = true;
            draft.addNotificationDone = false;
            draft.addNotificationError = null;
            break;

        case ADD_NOTIFICATION_SUCCESS:
            console.log('🐢 ADD_NOTIFICATION_SUCCESS : ', action.data);
            const newNotificaton = action.data;
            draft.addNotificationLoading = false;
            draft.addNotificationDone = true;
            draft.addNotificationError = null;
            draft.mainNotification = [newNotificaton, ...draft.mainNotification];
            console.log('🐢 draft.mainNotification : ', draft.mainNotification);
            break;

        case ADD_NOTIFICATION_FAILURE:
            draft.addNotificationLoading = false;
            draft.addNotificationDone = false;
            draft.addNotificationError = action.error;
            console.log('🐢 ADD_NOTIFICATION_FAILURE : ', action.error);
            break;

        ////////////////////////////////////////
        case REMOVE_NOTIFICATION_REQUEST:
            draft.removeNotificationLoading = true;
            draft.removeNotificationDone = false;
            draft.removeNotificationError = null;
            break;

        case REMOVE_NOTIFICATION_SUCCESS:
            draft.mainNotification = draft.mainNotification.filter((n) => n.id !== action.data);
            draft.removeNotificationLoading = false;
            draft.removeNotificationDone = true;
            draft.removeNotificationError = null;
            break;

        case REMOVE_NOTIFICATION_FAILURE:
            draft.removeNotificationLoading = false;
            draft.removeNotificationDone = false;
            draft.removeNotificationError = action.error;
            break;

        ////////////////////////////////////////
        default:
            break;
    }
});

export default reducer;
