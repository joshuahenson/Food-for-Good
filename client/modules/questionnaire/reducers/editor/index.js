import {normalize, denormalize} from 'normalizr'
import {get} from 'lodash'
import uuid from 'uuid'

import {questionnaire as questionnaireSchema} from '../../../../store/schemas'
import sections from './sections'
import fields from './fields'

export const actions = {
  INIT: 'qEditor/INIT',
  EDIT_SECTION: 'qEditor/EDIT_SECTION',
  EDIT_FIELD: 'qEditor/EDIT_FIELD',
  SELECT_SECTION: 'qEditor/SELECT_SECTION',
  ADD_SECTION: 'qEditor/section/ADD',
  DELETE_SECTION: 'qEditor/section/DELETE',
  MOVE_SECTION: 'qEditor/section/MOVE',
  UPDATE_SECTION: 'qEditor/section/UPDATE',
  ADD_FIELD: 'qEditor/field/ADD',
  DELETE_FIELD: 'qEditor/field/DELETE',
  UPDATE_FIELD: 'qEditor/field/UPDATE',
  MOVE_FIELD: 'qEditor/field/MOVE'
}

export const init = questionnaire => ({
  type: actions.INIT,
  ...normalize(questionnaire, questionnaireSchema).entities
})

export const editSection = sectionId => ({
  type: actions.EDIT_SECTION,
  sectionId
})

export const editField = fieldId => ({
  type: actions.EDIT_FIELD,
  fieldId
})

export const selectSection = sectionId => ({
  type: actions.SELECT_SECTION,
  sectionId
})

export const addSection = section => dispatch => {
  const newSection = {_id: uuid.v4(), name: '', ...section}
  dispatch({
    type: actions.ADD_SECTION,
    section: newSection
  })

  dispatch(editSection(newSection._id))
}

export const deleteSection = sectionId => ({
  type: actions.DELETE_SECTION,
  sectionId
})

export const updateSection = section => ({
  type: actions.UPDATE_SECTION,
  section
})

export const moveSection = (sectionId, idx) => ({
  type: actions.MOVE_SECTION,
  sectionId,
  idx
})

export const addField = (field, sectionId) => dispatch => {
  const newField = {_id: uuid.v4(), label: '', type: 'text', ...field}
  dispatch({
    type: actions.ADD_FIELD,
    field: newField,
    sectionId
  })

  dispatch(editField(newField._id))
}

export const deleteField = (fieldId, sectionId) => ({
  type: actions.DELETE_FIELD,
  fieldId,
  sectionId
})

export const updateField = field => ({
  type: actions.UPDATE_FIELD,
  field
})

export const moveField = (fieldId, sectionId, idx) => ({
  type: actions.MOVE_FIELD,
  fieldId,
  sectionId,
  idx
})


export default (state = {questionnaires: {}}, action) => {
  switch (action.type) {
    case actions.INIT: {
      const _sections = sections(null, action)
      return {
        questionnaires: action.questionnaires,
        sections: _sections,
        fields: fields(null, action),
        selectedSection: _sections.length && _sections[0]._id
      }
    }
    case actions.EDIT_SECTION:
      return {
        ...state,
        editingSection: action.sectionId
      }
    case actions.EDIT_FIELD:
      return {
        ...state,
        editingField: action.fieldId
      }
    case actions.SELECT_SECTION:
      return {
        ...state,
        selectedSection: action.sectionId
      }
    default:
      return {
        ...state,
        sections: sections(state.sections, action),
        fields: fields(state.fields, action)
      }
  }
}

export const createSelectors = path => ({
  getSectionIds: state => get(state, path).sections.allIds,
  getSectionById: state => id => get(state, path).sections.byId[id],
  getFieldIds: state => sectionId => {
    const section = get(state, path).sections.byId[sectionId]
    if (!section) return
    return section.fields
  },
  getFieldById: state => id => get(state, path).fields.byId[id],
  getEditingQuestionnaire: state => {
    const questionnaires = Object.values(get(state, path).questionnaires)
    if (!questionnaires.length) return
    return questionnaires[0]
  },
  getEditingSection: state => get(state, path).editingSection,
  getEditingField: state => get(state, path).editingField,
  getSelectedSection: state => get(state, path).selectedSection,
  getCompleteQuestionnaire: state => {
    const {sections, fields} = get(state, path)
    const questionnaires = Object.values(get(state, path).questionnaires)
    if (!questionnaires.length) return

    const questionnaire = questionnaires[0]

    return denormalize(
      {questionnaires: questionnaire._id},
      {questionnaires: questionnaireSchema},
      {
        questionnaires: reorderSections(questionnaire, sections),
        sections: sections.byId,
        fields: fields.byId
      }
    ).questionnaires
  }
})

// Order section ids in questionnaire by order listed in state
function reorderSections(questionnaire, sections) {
  return {
    [questionnaire._id]: {
      ...questionnaire,
      sections: sections.allIds.map(id => ({id: sections.byId[id]}))
    }
  }
}
