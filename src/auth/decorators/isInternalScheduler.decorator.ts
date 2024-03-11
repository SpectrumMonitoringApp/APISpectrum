import { SetMetadata } from '@nestjs/common';

export const IS_INTERNAL_SCHEDULER_KEY = 'isInternalScheduler';
export const InternalScheduler = () => SetMetadata(IS_INTERNAL_SCHEDULER_KEY, true);
