export const APPLICATION_COLUMNS = 'id, job_id, candidate_name, candidate_email, candidate_phone, name, email, phone, status, city, state, profile_pic, created_at' as const;

export const JOB_COLUMNS = 'id, company_id, title, role, company_name, modality, state, city, salary, salary_min, salary_max, remuneration_type, has_bonus, bonus_type, bonus_value, contract_type, description, requirements, stages, work_schedule, min_age, is_first_job, is_pcd, pcd_details, positions, request_reason, is_urgent, responsibilities, benefits, status, created_at' as const;

export const MESSAGE_COLUMNS = 'id, application_id, sender_type, sender_name, content, message, read, created_at' as const;

export const INTERVIEW_COLUMNS = 'id, job_id, candidate_email, company_name, date_time, scheduled_at, notes, status, room_name, transcript, ai_report, ai_report_json, transcript_status, transcript_generated_at, ai_report_generated_at, created_at' as const;

export const CANDIDATE_INTERVIEW_COLUMNS = 'id, job_id, candidate_email, company_name, date_time, scheduled_at, notes, status, room_name, transcript, ai_report, ai_report_json, transcript_status, transcript_generated_at, ai_report_generated_at, created_at, job:jobs(id, title, company_name)' as const;

export const NOTIFICATION_COLUMNS = 'id, user_id, user_type, title, message, job_id, read, created_at' as const;
