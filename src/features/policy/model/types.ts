// 스웨거 GET /api/policy/{type}의 path parameter Available values 기준.
export type PolicyType = 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY' | 'LOCATION_SERVICE' | 'HEALTH_INFO_CONSENT';

export interface PolicySummary {
  type: PolicyType;
  title: string;
}

export interface PolicyDetail extends PolicySummary {
  content: string;
  updatedAt: string;
}
