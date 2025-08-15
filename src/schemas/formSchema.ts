import { z } from 'zod';
import { addDays, isWeekend, parseISO, isBefore, differenceInYears } from 'date-fns';

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'] as const;
const jobTypes = ['Full-time', 'Part-time', 'Contract'] as const;
const allowedSkills = ['JavaScript', 'Python', 'SQL'] as const;
const baseSchema = z.object({
    // Step 1: Personal Info
    fullName: z.string().min(1, 'Required').refine((val) => val.trim().split(' ').length >= 2, 'Must have at least 2 words'),
    email: z.string().email('Invalid email'),
    phoneNumber: z.string().regex(/^\+\d{1}-\d{3}-\d{3}-\d{4}$/, 'Format: +1-123-456-7890'),
    dateOfBirth: z.string().refine((val) => {
        const age = differenceInYears(new Date(), parseISO(val));
        return age >= 18;
    }, 'Must be at least 18 years old'),
    profilePicture: z.any().optional().refine((file) => {
        if (!file) return true;
        return ['image/jpeg', 'image/png'].includes(file.type) && file.size <= 2 * 1024 * 1024;
    }, 'JPG/PNG only, max 2MB'),

    // Step 2: Job Details
    department: z.enum(departments),
    positionTitle: z.string().min(3, 'Min 3 characters'),
    startDate: z.string().refine((val) => {
        const date = parseISO(val);
        return !isBefore(date, new Date()) && isBefore(date, addDays(new Date(), 90));
    }, 'Not in past, max 90 days future'),
    jobType: z.enum(jobTypes),
    salaryExpectation: z.number().min(0),
    manager: z.string().min(1, 'Required'),

    // Step 3: Skills & Preferences
    primarySkills: z.array(z.string()).min(3, 'At least 3 skills required'),
    //   skillExperiences: z.record(z.number().min(0, 'Experience must be 0 or more')),

    skillExperiences: z.record(z.enum(allowedSkills), z.number().min(0, 'Experience must be 0 or more')),
    preferredWorkingHoursStart: z.string(),
    preferredWorkingHoursEnd: z.string(),
    remoteWorkPreference: z.number().min(0).max(100),
    managerApproved: z.boolean().optional(),
    extraNotes: z.string().max(500, 'Max 500 characters').optional(),

    // Step 4: Emergency Contact
    emergencyContactName: z.string().min(1, 'Required'),
    emergencyRelationship: z.string().min(1, 'Required'),
    emergencyPhone: z.string().regex(/^\+\d{1}-\d{3}-\d{3}-\d{4}$/, 'Format: +1-123-456-7890'),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),

    // Step 5: Review & Submit
    confirm: z.boolean().refine((val) => val, 'Must confirm information'),
});

export const formSchema = baseSchema.superRefine((data, ctx) => {
    // Salary validation based on job type
    if (data.jobType === 'Full-time') {
        if (data.salaryExpectation < 30000 || data.salaryExpectation > 200000) {
            ctx.addIssue({ code: 'custom', message: '$30,000 - $200,000', path: ['salaryExpectation'] });
        }
    } else if (data.jobType === 'Contract') {
        if (data.salaryExpectation < 50 || data.salaryExpectation > 150) {
            ctx.addIssue({ code: 'custom', message: '$50 - $150/hour', path: ['salaryExpectation'] });
        }
    }

    // Weekend restriction for HR/Finance (Sat/Sun, adjust if Fri/Sat)
    if (['HR', 'Finance'].includes(data.department)) {
        const startDate = parseISO(data.startDate);
        if (isWeekend(startDate)) {
            ctx.addIssue({ code: 'custom', message: 'Cannot be on a weekend', path: ['startDate'] });
        }
    }

    // Guardian required if under 21
    const age = differenceInYears(new Date(), parseISO(data.dateOfBirth));
    if (age < 21) {
        if (!data.guardianName) ctx.addIssue({ code: 'custom', message: 'Required if under 21', path: ['guardianName'] });
        if (!data.guardianPhone || !/^\+\d{1}-\d{3}-\d{3}-\d{4}$/.test(data.guardianPhone)) {
            ctx.addIssue({ code: 'custom', message: 'Required and valid format', path: ['guardianPhone'] });
        }
    }

    // Manager approval required if remote preference > 50%
    if (data.remoteWorkPreference > 50 && !data.managerApproved) {
        ctx.addIssue({ code: 'custom', message: 'Manager approval required for >50% remote', path: ['managerApproved'] });
    }
});

export type FormData = z.infer<typeof formSchema>;