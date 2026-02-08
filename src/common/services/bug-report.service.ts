import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../appConfig';
import { ApiResponse } from './api-response';

export type BugReportScope = 'client' | 'server';
export type BugReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface BugReportPayload {
  title: string;
  description: string;
  pageUrl?: string | null;
  scope: BugReportScope;
  severity: BugReportSeverity;
}

export interface BugReportRecord {
  id: number;
  userId: number | null;
  title: string;
  description: string;
  pageUrl: string | null;
  scope: BugReportScope;
  severity: BugReportSeverity;
  status: 'open' | 'in_progress' | 'resolved' | string;
  createdAt: string;
  updatedAt: string;
  reporter?: {
    id: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
  } | null;
}

export interface BugReportsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class BugReportService {
  constructor(private http: HttpClient) {}

  createBugReport(
    bugReport: BugReportPayload
  ): Observable<ApiResponse<{ bugReport: BugReportRecord }>> {
    return this.http.post<ApiResponse<{ bugReport: BugReportRecord }>>(
      `${baseUrl}/bug-reports`,
      { bugReport }
    );
  }

  getBugReports(
    params: { page?: number; limit?: number; status?: string; q?: string } = {}
  ): Observable<ApiResponse<{ bugReports: BugReportRecord[] }>> {
    const query = new URLSearchParams();
    query.set('page', String(params.page || 1));
    query.set('limit', String(params.limit || 20));
    if (params.status) {
      query.set('status', params.status);
    }
    if (params.q) {
      query.set('q', params.q);
    }
    return this.http.get<ApiResponse<{ bugReports: BugReportRecord[] }>>(
      `${baseUrl}/bug-reports?${query.toString()}`
    );
  }

  updateBugReportStatus(
    bugReportId: number,
    status: 'open' | 'in_progress' | 'resolved' | 'rejected'
  ): Observable<ApiResponse<{ bugReport: BugReportRecord }>> {
    return this.http.patch<ApiResponse<{ bugReport: BugReportRecord }>>(
      `${baseUrl}/bug-reports/${bugReportId}/status`,
      {
        bugReport: { status },
      }
    );
  }

  getBugReportById(
    bugReportId: number | string
  ): Observable<ApiResponse<{ bugReport: BugReportRecord }>> {
    return this.http.get<ApiResponse<{ bugReport: BugReportRecord }>>(
      `${baseUrl}/bug-reports/${bugReportId}`
    );
  }
}
