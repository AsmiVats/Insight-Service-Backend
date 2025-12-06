declare namespace Express {
	export interface Request {
		tenant?: string;
		tenantId?: string;
	}
}
