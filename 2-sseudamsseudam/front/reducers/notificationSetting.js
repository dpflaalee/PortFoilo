import produce from 'immer';

export const LOAD_NOTIFICATION_SETTING_REQUEST = 'LOAD_NOTIFICATION_SETTING_REQUEST';
export const LOAD_NOTIFICATION_SETTING_SUCCESS = 'LOAD_NOTIFICATION_SETTING_SUCCESS';
export const LOAD_NOTIFICATION_SETTING_FAILURE = 'LOAD_NOTIFICATION_SETTING_FAILURE';

export const UPDATE_NOTIFICATION_SETTING_REQUEST = 'UPDATE_NOTIFICATION_SETTING_REQUEST';
export const UPDATE_NOTIFICATION_SETTING_SUCCESS = 'UPDATE_NOTIFICATION_SETTING_SUCCESS';
export const UPDATE_NOTIFICATION_SETTING_FAILURE = 'UPDATE_NOTIFICATION_SETTING_FAILURE';

const initialState = {
    settings: {},
    loadSettingsLoading: false,
    loadSettingsDone: false,
    loadSettingsError: null,

    updateSettingLoading: false,
    updateSettingDone: false,
    updateSettingError: null,
};

const reducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case LOAD_NOTIFICATION_SETTING_REQUEST:
                draft.loadSettingsLoading = true;
                draft.loadSettingsDone = false;
                draft.loadSettingsError = null;
                break;
            case LOAD_NOTIFICATION_SETTING_SUCCESS:
                draft.settings = {};
                action.data.forEach((setting) => {
                    draft.settings[setting.type] = setting.enabled;
                });
                draft.loadSettingsLoading = false;
                draft.loadSettingsDone = true;
                break;
            case LOAD_NOTIFICATION_SETTING_FAILURE:
                draft.loadSettingsLoading = false;
                draft.loadSettingsError = action.error;
                break;

            case UPDATE_NOTIFICATION_SETTING_REQUEST:
                draft.updateSettingLoading = true;
                draft.updateSettingDone = false;
                draft.updateSettingError = null;
                break;
            case UPDATE_NOTIFICATION_SETTING_SUCCESS:
                draft.updateSettingLoading = false;
                draft.updateSettingDone = true;
                draft.settings[action.data.type] = action.data.enabled;
                break;
            case UPDATE_NOTIFICATION_SETTING_FAILURE:
                draft.updateSettingLoading = false;
                draft.updateSettingError = action.error;
                break;

            default:
                break;
        }
    });

export default reducer;
