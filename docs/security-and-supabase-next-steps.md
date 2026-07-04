# Security and Supabase Next Steps

## Resume Parsing Endpoint

The frontend now calls `VITE_RESUME_PARSE_ENDPOINT` instead of using Gemini directly in the browser.

Recommended deployment target:

- Supabase Edge Function: `supabase/functions/parse-resume`

Required secrets:

- `GEMINI_API_KEY`
- Optional: `GEMINI_MODEL`, defaults to `gemini-2.0-flash`
- Optional: `ALLOWED_ORIGIN`, recommended in production to restrict browser origins.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are available automatically in Supabase Edge Functions and are used to validate the bearer token.

Example frontend env:

```env
VITE_RESUME_PARSE_ENDPOINT="https://<project-ref>.supabase.co/functions/v1/parse-resume"
```

Deploy outline:

```bash
supabase functions deploy parse-resume
supabase secrets set GEMINI_API_KEY="<your-key>"
```

The function now requires an authenticated Supabase user, accepts only PDF/DOC/DOCX/TXT/JPG/PNG files, and the frontend sends the current session token in the `Authorization` header.

## Database Direction

The database now has additive migrations for the main normalized data model and RLS hardening:

- `202606170001_security_foundation.sql`: `companies`, `job_stages`, `job_stage_tests`, `application_assessments`, `custom_questionnaires`
- `202606170002_tighten_assessment_workflow_rls.sql`: tighter assessment/workflow RLS
- `202606170003_application_notes.sql`: normalized recruiter notes
- `202606170004_jobs_applications_rls.sql`: RLS for `jobs` and `applications`
- `202606170005_communication_rls.sql`: RLS for `messages`, `interviews`, and `notifications`
- `202606170006_talents_rls.sql`: RLS for `talents`
- `202606170007_messages_content_compat.sql`: compatibility between `messages.content` and `messages.message`
- `202606180008_candidate_registration_uniqueness.sql`: candidate registration duplicate checks for email/phone
- `202606180009_auth_email_conflict_check.sql`: duplicate candidate email checks now include Supabase Auth users
- `202606180010_jobs_public_read_policy.sql`: idempotent public read policy for active job discovery
- `202606180011_list_active_jobs_rpc.sql`: secure fallback RPC for candidate active job discovery
- `202606180012_jobs_role_column.sql`: adds the optional `jobs.role` column expected by the frontend
- `202606180013_list_job_applications_rpc.sql`: secure fallback RPC for company applicant loading by job
- `202606180014_candidate_applications_rpc.sql`: secure fallback RPCs for candidate application and assessment loading
- `202606180015_secure_candidate_rpc.sql`: tightens candidate RPC fallback parameters to the authenticated candidate email
- `202606180016_send_application_message_rpc.sql`: secure fallback RPC for company/candidate chat message sending
- `202606180017_harden_send_application_message_rpc.sql`: makes chat message RPC tolerant to legacy `messages.application_id` column types
- `202606180018_reload_postgrest_schema.sql`: requests PostgREST schema reload after RPC changes
- `202606180019_messages_sender_name_column.sql`: adds missing `messages.sender_name` compatibility column

The app now writes companies, assessment workflow, custom questionnaire templates, recruiter notes, job stages, and stage tests to Supabase-backed tables. Legacy serialized markers are still hydrated into the UI for compatibility.
Legacy `candidate_phone` marker parsing is centralized in `src/utils/candidatePhoneData.ts` so the company and candidate dashboards share the same compatibility behavior.
Job stage/test markers in `jobs.description` are no longer written during normal updates; they are kept only as a fallback when normalized workflow writes are unavailable.
Candidate registration now checks duplicate candidate email and WhatsApp before calling Supabase Auth; email checks include both `talents` and Supabase Auth users.
Company dashboard no longer reuses globally cached company selection when Supabase is configured; it loads/creates the company owned by the authenticated user.
Published jobs are inserted into the company dashboard state immediately after successful creation and the UI switches to `Minhas Vagas`.
Candidate job discovery uses a schema-tolerant job service and an active-jobs RPC fallback so active jobs still load if the direct query returns no rows due to schema/RLS drift.
Company job loading now uses the same schema-tolerant job service and filters by selected company id/name client-side before counting applications.
Company applicant loading now uses a job-scoped service with an owner-checked RPC fallback.
Candidate application and assessment loading now use owner-checked RPC fallbacks so requested tests can appear under the candidate test menu even when direct RLS reads are incomplete.
Company/candidate chat message sending now has an owner-checked RPC fallback when direct message insertion is blocked by RLS drift.
Company notification loading now merges `company_id`, legacy company-name identifiers, and the selected company's job ids so older and newer notification rows remain visible.
Company notification polling/state was extracted from `CompanyDashboard.tsx` into `src/hooks/useCompanyNotifications.ts` as the first focused dashboard hook.
Company chat drawer state, polling, read marking, message sending, and candidate notification dispatch were extracted into `src/hooks/useCompanyChat.ts`.
Company interview loading, scheduling, status updates, video room state, candidate stage movement, and interview notifications were extracted into `src/hooks/useCompanyInterviews.ts`.
Company job loading, company job filtering, candidate counts, and aggregate dashboard application loading were extracted into `src/hooks/useCompanyJobs.ts`.
Company dashboard derived metrics, chart series, vacancy distribution, and top-skill calculations were extracted into `src/hooks/useCompanyDashboardMetrics.ts`.
Company dashboard navigation now follows the reference SaaS layout with a fixed white icon rail, expandable labels, hover tooltips, and header/content offset beside the rail.
Company applicant notes hydration, editing drawer state, saving, legacy marker fallback, and local applicant updates were extracted into `src/hooks/useCompanyApplicantNotes.ts`.
Assessment request stage/test gating was extracted into `src/hooks/useAssessmentRequestGate.ts` and reused by DISC, MBTI, Temperamentos, profile questions, and custom questionnaire requests.
Previous completed assessment lookup was centralized in `assessmentService.findPreviousCompletedAssessmentLegacyValue`, including normalized `application_assessments`, talent email lookup, and legacy `candidate_phone` fallback.
Assessment pending/completed persistence with legacy `candidate_phone` fallback was centralized in `assessmentService` helper functions.
Repeated local candidate `candidate_phone` updates in `CompanyDashboard.tsx` now go through `updateApplicantCandidatePhone`.
Repeated candidate notifications for assessment requests in `CompanyDashboard.tsx` now go through `notifyCandidateAssessmentRequest`.
Legacy assessment marker updates for DISC, profile questions, MBTI, Temperamentos, and custom questionnaires now go through `serializeCandidatePhoneWithAssessment`.
Company assessment credit validation/deduction was extracted into `src/hooks/useCompanyAssessmentCredits.ts`.
Company assessment request handlers for DISC, profile questions, MBTI, Temperamentos, and custom questionnaires were extracted into `src/hooks/useCompanyAssessmentRequests.ts`.
Company assessment applicant state updates and candidate assessment notifications were extracted into `src/hooks/useCompanyAssessmentApplicantUpdates.ts`.
Company custom questionnaire library state, loading, migration, editing, saving, and deletion were extracted into `src/hooks/useCompanyCustomQuestionnaires.ts`.
Company job workflow stage state, stage persistence, stage-test persistence, and stage deletion guards were extracted into `src/hooks/useCompanyJobWorkflow.ts`.
Company job applicant loading and pipeline opening were extracted into `src/hooks/useCompanyJobApplicants.ts`.
Company talent bank loading, filtering, saved-talents toggling, AI search keyword handling, and city loading were extracted into `src/hooks/useCompanyTalentBank.ts`.
Company management form state, selected-company form sync, create/update/delete operations, and logo handling were extracted into `src/hooks/useCompanyManagement.ts`.
Company job share, status update, and deletion actions were extracted into `src/hooks/useCompanyJobActions.ts`.
Company vacancy description and insert payload construction were extracted into `src/utils/vacancyPayload.ts`.
Company vacancy publishing state, step validation, schema-tolerant insertion, stage sync, and published-link state were extracted into `src/hooks/useCompanyVacancyPublishing.ts`.
Company applicant status updates, candidate status notifications, and automatic stage-test requests were extracted into `src/hooks/useCompanyApplicantStatus.ts`.
Company PDF export state, resume export, test-report export, and oklch/oklab print color handling were extracted into `src/hooks/useCompanyPdfExport.ts`.
Company dashboard bootstrap effects for page background, remote company loading, local cache sync, and session company name were extracted into `src/hooks/useCompanyBootstrap.ts`.
Candidate notification polling, drawer state, mark-read actions, and deletion were extracted into `src/hooks/useCandidateNotifications.ts`.
Candidate interview loading, loading state, and active video meeting state were extracted into `src/hooks/useCandidateInterviews.ts`.
Candidate chat conversation loading, unread counts, read marking, reply sending, and company reply notifications were extracted into `src/hooks/useCandidateChat.ts`.
Candidate application hydration and applied-job tracking were extracted into `src/hooks/useCandidateApplications.ts`.
Candidate vacancy search/filter state, city filter loading, filtered vacancy derivation, and clear-filter action were extracted into `src/hooks/useCandidateVacancyFilters.ts`.
Candidate active vacancy loading, workflow hydration, shared-link ordering, loading state, and load-error state were extracted into `src/hooks/useCandidateVacancies.ts`.
Candidate resume PDF export state, print ref, html2canvas/jsPDF generation, and oklch/oklab print fallback were extracted into `src/hooks/useCandidateResumeExport.ts`.
Candidate profile city loading by selected Brazilian state was extracted into `src/hooks/useBrazilCities.ts`.
Candidate profile photo selection, size validation, crop modal state, and cropped image generation were extracted into `src/hooks/useCandidateProfilePhotoCrop.ts`.
Candidate resume validation, Supabase talent upsert, save loading state, and post-save dirty-state reset were extracted into `src/hooks/useCandidateResumeSave.ts`.
Candidate AI resume parsing, secure parse endpoint calls, response normalization, and parsed resume state updates were extracted into `src/hooks/useCandidateResumeParser.ts`.
Candidate DISC assessment state, scoring, completion persistence, and legacy phone-marker fallback were extracted into `src/hooks/useCandidateDiscAssessment.ts`.
Candidate profile questions assessment state, validation, completion persistence, and legacy phone-marker fallback were extracted into `src/hooks/useCandidateQuestionsAssessment.ts`.
Candidate MBTI assessment state, score calculation, completion persistence, and legacy phone-marker fallback were extracted into `src/hooks/useCandidateMbtiAssessment.ts`.
Candidate temperaments assessment state, score calculation, completion persistence, and legacy phone-marker fallback were extracted into `src/hooks/useCandidateTemperamentosAssessment.ts`.
Candidate custom questionnaire assessment state, start flow, validation, completion persistence, and legacy phone-marker fallback were extracted into `src/hooks/useCandidateCustomAssessment.ts`.
Candidate job application submission, schema-tolerant insert retry, company notification, and applying state were extracted into `src/hooks/useCandidateJobApplication.ts`.
Candidate assessment status parsing and pending/completed test list derivation were extracted into `src/utils/candidateAssessmentStatus.ts`.
Candidate resume profile bootstrap, original snapshot tracking, dirty-state detection, before-unload guard, and section-completion checks were extracted into `src/hooks/useCandidateResumeProfile.ts`.
Candidate password update validation, Supabase Auth password change, loading state, and form reset were extracted into `src/hooks/useCandidatePasswordUpdate.ts`.
Candidate shell UI state for profile menu, header scroll, page background, and outside-click handling was extracted into `src/hooks/useCandidateShellUi.ts`.
Candidate custom alert/success/confirm dialog state and commands were extracted into `src/hooks/useCandidateDialog.ts`.
Candidate resume editor UI state for action dropdown, edit modals, editing records, and temporary experience form state was extracted into `src/hooks/useCandidateResumeEditorUi.ts`.
Candidate custom alert/success/confirm modal UI was extracted into `src/components/candidate/CandidateDialogModal.tsx`.
Candidate profile photo crop modal UI was extracted into `src/components/candidate/CandidatePhotoCropModal.tsx`.
Candidate top header, chat/notification badges, and profile dropdown UI were extracted into `src/components/candidate/CandidateHeader.tsx`.
Candidate desktop sidebar and mobile bottom navigation were extracted into `src/components/candidate/CandidateNavigation.tsx`.
Candidate interviews tab UI, interview cards, loading/empty states, and join-call action were extracted into `src/components/candidate/CandidateInterviewsTab.tsx`.
Candidate resume PDF capture now reuses the shared A4 resume preview component, and an unused legacy resume preview drawer was removed.
Candidate A4 resume preview/PDF template was moved into `src/components/candidate/ResumeA4Preview.tsx`.
Candidate DISC static question bank was moved into `src/data/discQuestions.ts`.
Candidate chat drawer UI, conversation list, message list, and reply form were extracted into `src/components/candidate/CandidateChatDrawer.tsx`.
Candidate profile-question bank was moved into `src/data/profileQuestions.ts`, and duplicate custom-assessment parsing helpers were removed from `CandidateDashboard.tsx` in favor of shared utilities.
Candidate vacancy filter drawer UI was extracted into `src/components/candidate/CandidateVacancyFilterDrawer.tsx`.
Candidate test result drawer shell/header was extracted into `src/components/candidate/CandidateTestResultDrawer.tsx`.
Candidate vacancy details drawer UI was extracted into `src/components/candidate/CandidateVacancyDetailsDrawer.tsx`.
Candidate vacancy text cleanup/list helpers were moved into `src/utils/candidateVacancyText.ts`.
Candidate test result drawer content for DISC, profile questions, MBTI, temperaments, and custom questionnaires was extracted into `src/components/candidate/CandidateTestResultContent.tsx`.
Candidate resume preview modal was extracted into `src/components/candidate/CandidateResumePreviewModal.tsx`.
Candidate AI resume parsing overlay was extracted into `src/components/candidate/CandidateAiParsingOverlay.tsx`.
Candidate vacancy tab UI, active-job cards, search/filter controls, and candidate application list were extracted into `src/components/candidate/CandidateVacanciesTab.tsx`.
Candidate settings/profile/password tab UI was extracted into `src/components/candidate/CandidateSettingsTab.tsx`.
Candidate resume section card grid was extracted into `src/components/candidate/CandidateResumeSectionGrid.tsx`.
Candidate resume action menu for AI parsing, preview, and PDF download was extracted into `src/components/candidate/CandidateResumeActionMenu.tsx`.
Candidate assessment overview lists for pending/completed tests were extracted into `src/components/candidate/CandidateTestsOverviewTab.tsx`.
Candidate assessment intro screens for DISC, profile questions, MBTI, temperaments, and custom questionnaires now reuse `src/components/candidate/CandidateAssessmentIntroCard.tsx`.
Candidate DISC in-progress assessment UI and ranking interaction were extracted into `src/components/candidate/CandidateDiscAssessmentStep.tsx`.
Candidate profile-questions in-progress assessment UI and validation were extracted into `src/components/candidate/CandidateQuestionsAssessmentStep.tsx`.
Candidate MBTI in-progress assessment UI, scoring interaction, and step validation were extracted into `src/components/candidate/CandidateMbtiAssessmentStep.tsx`.
Candidate temperaments in-progress assessment UI, choice interaction, and step validation were extracted into `src/components/candidate/CandidateTemperamentosAssessmentStep.tsx`.
Candidate custom-questionnaire in-progress assessment UI was extracted into `src/components/candidate/CandidateCustomAssessmentStep.tsx`.
Candidate custom-questionnaire completion/result review UI was extracted into `src/components/candidate/CandidateCustomAssessmentCompleted.tsx`.
Candidate profile-questions completion/result review UI was extracted into `src/components/candidate/CandidateQuestionsAssessmentCompleted.tsx`.
Candidate DISC completion/result review UI was extracted into `src/components/candidate/CandidateDiscAssessmentCompleted.tsx`.
Candidate MBTI completion/result review UI was extracted into `src/components/candidate/CandidateMbtiAssessmentCompleted.tsx`.
Candidate temperaments completion/result review UI was extracted into `src/components/candidate/CandidateTemperamentosAssessmentCompleted.tsx`.
Candidate resume editor modal header and add-action bar were extracted into `src/components/candidate/CandidateResumeEditorModalHeader.tsx` and `src/components/candidate/CandidateResumeEditorAddBar.tsx`.
Candidate resume summary and skills editor sections were extracted into `src/components/candidate/CandidateResumeSummaryEditor.tsx` and `src/components/candidate/CandidateResumeSkillsEditor.tsx`.
Candidate resume languages and achievements editor sections were extracted into `src/components/candidate/CandidateResumeLanguagesEditor.tsx` and `src/components/candidate/CandidateResumeAchievementsEditor.tsx`.
Candidate resume diversity editor section was extracted into `src/components/candidate/CandidateResumeDiversityEditor.tsx`.
Candidate resume professional-experience editor section was extracted into `src/components/candidate/CandidateResumeExperienceEditor.tsx`.
Candidate resume education editor section was extracted into `src/components/candidate/CandidateResumeEducationEditor.tsx`.
Candidate resume personal-info editor section was extracted into `src/components/candidate/CandidateResumePersonalInfoEditor.tsx`.
Obsolete resume-editor UI state for diversity, language editing, and achievement editing was removed from `src/hooks/useCandidateResumeEditorUi.ts` and `src/components/CandidateDashboard.tsx`.
Candidate resume editor drawer shell was extracted into `src/components/candidate/CandidateResumeEditorModal.tsx`.
Candidate main resume tab shell was extracted into `src/components/candidate/CandidateResumeTab.tsx`.
Candidate tests tab workflow shell was extracted into `src/components/candidate/CandidateTestsTab.tsx`.
Candidate coming-soon placeholder panel was extracted into `src/components/candidate/CandidateComingSoonPanel.tsx`.
Candidate hidden resume print renderer was extracted into `src/components/candidate/CandidateHiddenResumePrint.tsx`.
Candidate shared-vacancy URL loading was extracted into `src/hooks/useCandidateSharedVacancyFromUrl.ts`.
Candidate resume language/achievement collection mutations were extracted into `src/hooks/useCandidateResumeCollections.ts`.
Candidate resume age and experience-duration calculations were extracted into `src/utils/candidateResumeCalculations.ts`.
Candidate tab-navigation dirty-resume confirmation was extracted into `src/hooks/useCandidateTabNavigation.ts`.
Candidate assessment start/result actions were extracted into `src/hooks/useCandidateAssessmentActions.ts`.
Candidate dashboard overlay/drawer cluster was extracted into `src/components/candidate/CandidateDashboardOverlays.tsx`.
Candidate video meeting and hidden resume print rendering were moved into `src/components/candidate/CandidateDashboardOverlays.tsx`.
Candidate dashboard tab content router was extracted into `src/components/candidate/CandidateDashboardContent.tsx`.
Candidate floating error toast was extracted into `src/components/candidate/CandidateFloatingError.tsx`.
Candidate decorative background was extracted into `src/components/candidate/CandidateBackgroundDecor.tsx`.
Candidate dashboard now reuses shared `BRAZIL_STATES` and `DF_REGIONS` from `src/utils/companyDashboardUtils.ts`.
Candidate readable error normalization was extracted into `src/utils/errorUtils.ts`.
Candidate tests-tab prop package was isolated behind `src/hooks/useCandidateTestsTabProps.ts` for later typed consolidation.
Candidate dashboard shell layout was extracted into `src/components/candidate/CandidateDashboardShell.tsx`.
Candidate tests-tab prop contract is now exported as `CandidateTestsTabProps` and reused by `src/hooks/useCandidateTestsTabProps.ts`.
Candidate assessment orchestration was consolidated into `src/hooks/useCandidateAssessments.ts`, covering DISC, profile questions, MBTI, temperaments, custom tests, pending/completed lists, and start/result actions.
Company dashboard lazy-loading fallbacks and sidebar item UI were extracted into `src/components/CompanyDashboard/CompanyDashboardLayout.tsx`.
Company candidate chat drawer UI was extracted into `src/components/CompanyDashboard/CompanyChatDrawer.tsx`.
Company applicant notes drawer UI was extracted into `src/components/CompanyDashboard/CompanyApplicantNotesDrawer.tsx`.
Company talent-bank filter drawer UI was extracted into `src/components/CompanyDashboard/CompanyTalentFiltersDrawer.tsx`.
Company candidate tests drawer UI was extracted into `src/components/CompanyDashboard/CompanyCandidateTestsDrawer.tsx`.
Company hidden resume print renderer was extracted into `src/components/CompanyDashboard/CompanyHiddenResumePrint.tsx`.
Company resume A4 document rendering is now shared between the detailed candidate drawer and hidden PDF print renderer via `CompanyResumeA4Document`.
Company detailed candidate resume tests tab was extracted into `src/components/CompanyDashboard/CompanyCandidateResumeTestsTab.tsx`.
Company detailed candidate profile drawer shell was extracted into `src/components/CompanyDashboard/CompanyCandidateProfileDrawer.tsx`.
Company DISC report modal was extracted into `src/components/CompanyDashboard/CompanyDiscReportModal.tsx`.
Company profile-questions report modal was extracted into `src/components/CompanyDashboard/CompanyQuestionsReportModal.tsx`.
Company MBTI report modal was extracted into `src/components/CompanyDashboard/CompanyMbtiReportModal.tsx`.
Company temperaments report modal was extracted into `src/components/CompanyDashboard/CompanyTemperamentosReportModal.tsx`.
Company custom-template request modal was extracted into `src/components/CompanyDashboard/CompanyCustomTemplateRequestModal.tsx`.
Company registration/edit drawer was extracted into `src/components/CompanyDashboard/CompanyRegistrationDrawer.tsx`.
Company custom-questionnaire creation/edit drawer was extracted into `src/components/CompanyDashboard/CompanyCustomQuestionnaireDrawer.tsx`.
Company assessment header subnavigation was extracted into `src/components/CompanyDashboard/CompanyAssessmentSubnav.tsx`.
Company custom alert/confirmation dialog was extracted into `src/components/CompanyDashboard/CompanyCustomDialog.tsx`.
Company published-job share-link modal was extracted into `src/components/CompanyDashboard/CompanyPublishedJobLinkModal.tsx`.
Company interviews tab and candidate interviews panel were extracted into `src/components/CompanyDashboard/CompanyInterviewsTab.tsx` and `src/components/CompanyDashboard/CompanyCandidateInterviewsPanel.tsx`.
Company companies-management tab was extracted into `src/components/CompanyDashboard/CompanyCompaniesTab.tsx`.
Company overview/dashboard tab was extracted into `src/components/CompanyDashboard/CompanyOverviewTab.tsx`.
Company vacancies section shell was extracted into `src/components/CompanyDashboard/CompanyVacanciesSection.tsx`.
Company talent-bank section shell was extracted into `src/components/CompanyDashboard/CompanyTalentBankSection.tsx`.
Company assessments section was extracted into `src/components/CompanyDashboard/CompanyAssessmentsSection.tsx`.
Company global overlays cluster was extracted into `src/components/CompanyDashboard/CompanyDashboardOverlays.tsx`.
Company desktop/mobile sidebar was extracted into `src/components/CompanyDashboard/CompanyDashboardSidebar.tsx`.
Company top header and assessment subnavigation wiring were extracted into `src/components/CompanyDashboard/CompanyDashboardHeader.tsx`.
Company main tab content router was extracted into `src/components/CompanyDashboard/CompanyDashboardContent.tsx`.
Company custom alert/confirmation state was extracted into `src/hooks/useCompanyCustomDialog.ts`.
Company dashboard header dropdown state was extracted into `src/hooks/useCompanyDashboardHeaderState.ts`.
Company assessment report modal state was extracted into `src/hooks/useCompanyAssessmentReportModals.ts`.
Company assessment request/modal flow state was extracted into `src/hooks/useCompanyAssessmentFlowState.ts`.
Company resume drawer selection state was extracted into `src/hooks/useCompanyResumeDrawerState.ts`.
Company selection/local fallback initialization was extracted into `src/hooks/useCompanySelectionState.ts`.
Company dashboard UI state was extracted into `src/hooks/useCompanyDashboardUiState.ts`.
Company applicant/talent pairing resolver was extracted into `src/hooks/useCompanyApplicantResolver.ts`.
Company selected-job reset effect was extracted into `src/hooks/useCompanySelectedJobReset.ts`.
Company dashboard tab selection handler was moved into `src/hooks/useCompanyDashboardUiState.ts`.
Company dashboard text emoji cleanup helper was moved into `src/utils/companyDashboardUtils.ts`.
Company applicants list state was moved into `src/hooks/useCompanyDashboardUiState.ts`.
Company selected-company lookup was moved into `src/hooks/useCompanySelectionState.ts`.
Company interview tab and candidate interview drawer rendering were extracted into `src/hooks/useCompanyInterviewPanels.tsx`.
Company assessment report modal and PDF export wiring were grouped in `src/hooks/useCompanyAssessmentReportState.ts`.
Company selection and bootstrap wiring were grouped in `src/hooks/useCompanySessionState.ts`.
Company assessment flow and custom questionnaire state were grouped in `src/hooks/useCompanyAssessmentWorkspace.ts`.
Company main content props were grouped by domain in `src/components/CompanyDashboard/CompanyDashboardContent.tsx`.
Company overlays props were grouped by domain in `src/components/CompanyDashboard/CompanyDashboardOverlays.tsx`.
Company content/overlay view prop assembly was extracted into `src/hooks/useCompanyDashboardViewProps.ts`.
Company sidebar and header prop assembly were also moved into `src/hooks/useCompanyDashboardViewProps.ts`.
Company dashboard view prop builders were split into `src/hooks/companyDashboardViewPropsBuilders.ts`.
Company sidebar, header, content, and overlay prop contracts are now exported and used by the view prop builders.
Company page shell markup was extracted into `src/components/CompanyDashboard/CompanyDashboardShell.tsx`.
Company video interview overlay rendering was restored in `src/components/CompanyDashboard/CompanyDashboardOverlays.tsx`.
Company dashboard view props now have typed contracts for sidebar, header, overview, billing, notifications, custom dialog, published-job modal, video meeting, notes, chat, talent filters, candidate tests, and company registration.
Company vacancy publishing props now use `VacancyFormData`, and `CreateVacancyTab` no longer duplicates the vacancy form type inline.
Company custom questionnaire, custom template request, assessment section, stage configuration, resume drawer, and report modal prop groups now have explicit typed contracts.
Company talent-bank and vacancies prop groups now have explicit typed contracts, including `TalentProfile`, `TalentFilters`, and `CompanyDashboardVacanciesProps`.
Company shared dashboard domain types were added in `src/types/companyDashboard.ts` for company, job, application, applicant, interview, and message records.
Company job/application hooks, vacancies kanban, candidate drawers, resume PDF, chat, tests, notes, and interview panels now consume the shared dashboard domain types.
Company header, assessment subnavigation, companies tab, custom questionnaire request modal, stage manager modal, and custom questions report modal now use explicit domain/service types.
Company vacancy creation, billing, talent bank, talent-bank section, and resume print education/experience structures now use explicit form/domain types instead of broad `any` contracts.
Company assessment report types were added for DISC, MBTI, temperaments, answers, and custom question items, and are now used by report modal state, overlays, content contracts, report modals, and the assessment reports section.
Company central UI state, resume drawer state, job actions, job workflow, selected-job reset, chat, interviews, assessment request gate, and assessment request flows now use shared company dashboard domain types.
Company candidate test/profile callbacks, custom questions modal, overview analytics data, applicant resolver, custom questionnaire management, interview panel wiring, vacancy publishing, and company PDF export now use explicit domain/chart/report types.
Company dashboard view prop builders now use a typed `CompanyDashboardViewContext` instead of broad `any`, and missing context fields for results tabs and video meetings were made explicit at the `CompanyDashboard.tsx` composition boundary.
Candidate vacancy/application/chat/interview/resume hooks now share candidate/company domain types, and candidate assessment flows now use typed DISC, MBTI, temperamentos, questions, and custom-test payloads.
Candidate hooks no longer expose broad `any` in the focused scan; resume parsing now normalizes untrusted AI JSON before updating the candidate profile.
Candidate vacancy, resume preview/PDF, and assessment UI components now consume shared candidate/company domain types instead of broad `any` props.
Candidate dashboard content, overlay, resume editor, and candidate assessment child components are now clear of explicit `any` in the focused candidate scan.
Explicit broad `any` was removed from the `src` scan, including candidate dashboards, login, video meeting, job workflow, and shared app helpers.
Shared-job helper logic in `App.tsx` now reuses the candidate vacancy text utilities for description, requirements, and benefits instead of maintaining duplicate parsing code.
Shared job public rendering was extracted from `App.tsx` into `src/components/SharedJobPage.tsx`, reducing the app shell and isolating the public vacancy view.
Landing page demo simulator state/effects and DISC result calculation were extracted into `src/hooks/useLandingDemoSimulator.ts`.
Company vacancy creation basic-info step was extracted from `CreateVacancyTab.tsx` into `src/components/CompanyDashboard/createVacancy/CreateVacancyStepBasics.tsx`.
Company vacancy creation requirements/accessibility step was extracted from `CreateVacancyTab.tsx` into `src/components/CompanyDashboard/createVacancy/CreateVacancyStepRequirements.tsx`.
Company vacancy creation description and stage-configuration steps were extracted into focused components under `src/components/CompanyDashboard/createVacancy/`.
Company vacancies list/grid rendering was extracted from `MyVacanciesTab.tsx` into `src/components/CompanyDashboard/vacancies/MyVacanciesListView.tsx`.
Company selected-vacancy kanban header and horizontal minimap were extracted into focused components under `src/components/CompanyDashboard/vacancies/`.
Company selected-vacancy kanban columns and applicant cards were extracted into `MyVacancyKanbanColumns.tsx` and `MyVacancyApplicantCard.tsx`.
Company assessment row normalization was moved to `src/utils/companyAssessmentRows.ts`, and assessment reports, guide, and custom questionnaire library were extracted into focused components under `src/components/CompanyDashboard/assessments/`.
Company dashboard sidebar was redesigned from a floating purple pill into a classic white fixed sidebar with collapsed icon mode, hover labels, and an expand/collapse control.
Company dashboard shell was adjusted so the header spans the full width and the classic sidebar starts below it instead of covering the header area.

Compatibility fallback still exists for:

- `applications.candidate_phone` markers such as `===DISC===`
- `jobs.description` markers such as `===ETAPAS_JSON===`
- local notification fallback when Supabase is unavailable

## Next Implementation Slices

1. Manually validate RLS with one real company user and one real candidate user.
2. Apply `202606170007_messages_content_compat.sql` to the remote Supabase project if it has not been pushed yet.
3. Migrate remaining previous-assessment lookups away from `applications.candidate_phone` into `application_assessments`.
4. Migrate candidate/public job detail screens to read normalized stage data directly instead of parsing legacy `jobs.description` markers.
5. Continue splitting `CompanyDashboard.tsx` and `CandidateDashboard.tsx` into focused hooks/services/components, starting with chat, interviews, and assessment request flows.
6. Add automated tests for candidate application, assessment completion, company workflow, chat, notes, notifications, and RLS-sensitive service calls.

## Production Validation Checklist

Run these after linking the local project to the real Supabase project:

```bash
supabase db push
supabase functions deploy parse-resume
supabase secrets set GEMINI_API_KEY="<your-key>"
```

Then validate:

- Candidate can parse a resume while logged in.
- Anonymous request to `parse-resume` returns `401`.
- Company owner can write stages/tests only for its own jobs.
- Candidate can submit only assessments for their own applications.
- Company owner can read assessment results only for applications tied to its jobs.
- Company owner can open candidates only for its own jobs.
- Candidate can see only their own applications, messages, interviews, and notifications.
- Company can create/read/update only its own jobs, interviews, notes, and chat messages.
- Newly registered company user lands on its own company account, not on a company cached from another browser session.
- Company can publish a job and see it immediately under `Minhas Vagas > Ativas`.
- Company can see a job after candidates apply and open the candidate pipeline.
- Candidate can see active company jobs under `Vagas > Todas as Vagas`.
- Candidate can see requested tests under `Testes > Pendentes`.
- Company can send a chat message to a candidate from the applicant drawer.
- Talent bank is visible to company users, while candidates can update only their own profile.
- Candidate cannot create a second account with an already registered candidate email.
- Candidate cannot create a second account with an already registered WhatsApp number.
