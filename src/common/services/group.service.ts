import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Group,
  GroupsAPIResp,
  GroupUnassignedUsersAPIResp,
  GroupUsers,
} from '../../features/pages/circles-page/models/groups';
import {
  GroupTopicApiResponse,
  GroupTopicsApiResponse,
} from '../../features/pages/circles-page/models/group-topic';
import { baseUrl } from '../../appConfig';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  countAllActiveGroups(): Observable<{ status: number; count: number }> {
    return this.http.get<{ status: number; count: number }>(
      baseUrl + '/groups/count'
    );
  }

  getAllGroupsAndCount(params: {
    page: number;
    limit: number;
    name?: string;
    status?: 'all' | 'active' | 'inactive';
    encodedBy?: string;
    createdFrom?: string;
    createdTo?: string;
  }): Observable<GroupsAPIResp> {
    const query = new URLSearchParams();
    query.set('page', String(params.page));
    query.set('limit', String(params.limit));
    if (params.name) query.set('name', params.name);
    if (params.status) query.set('status', params.status);
    if (params.encodedBy) query.set('encodedBy', params.encodedBy);
    if (params.createdFrom) query.set('createdFrom', params.createdFrom);
    if (params.createdTo) query.set('createdTo', params.createdTo);

    return this.http.get<GroupsAPIResp>(baseUrl + `/groups?${query.toString()}`);
  }

  createGroup(group: Group): Observable<GroupsAPIResp> {
    return this.http.post<GroupsAPIResp>(baseUrl + '/groups', { group });
  }

  deleteGroup(id: number): Observable<GroupsAPIResp> {
    return this.http.delete<GroupsAPIResp>(baseUrl + `/groups/${id}`);
  }

  getGroupById(id: string): Observable<GroupsAPIResp> {
    return this.http.get<GroupsAPIResp>(baseUrl + `/groups/${id}`);
  }

  getUnassignedUsers(
    searchKeyword: string
  ): Observable<GroupUnassignedUsersAPIResp> {
    return this.http.get<GroupUnassignedUsersAPIResp>(
      baseUrl + `/groups/unassigned-users?keyword=${searchKeyword}`
    );
  }

  assignUsersToGroup(userAndGroupIds: GroupUsers[]): Observable<GroupsAPIResp> {
    return this.http.post<GroupsAPIResp>(baseUrl + '/groups/assign', {
      data: userAndGroupIds,
    });
  }

  removeUserFromGroup(groupId: number, userId: number): Observable<GroupsAPIResp> {
    return this.http.delete<GroupsAPIResp>(baseUrl + `/groups/${groupId}/user/${userId}`);
  }

  assignGroupAdministrator(
    groupId: number,
    userId: number
  ): Observable<GroupsAPIResp> {
    return this.http.patch<GroupsAPIResp>(
      baseUrl + `/groups/${groupId}/administrator/${userId}`,
      {}
    );
  }

  getGroupTopics(groupId: number | string): Observable<GroupTopicsApiResponse> {
    return this.http.get<GroupTopicsApiResponse>(baseUrl + `/groups/${groupId}/topics`);
  }

  createGroupTopic(
    groupId: number | string,
    topic: { title: string; description?: string | null }
  ): Observable<GroupTopicApiResponse> {
    return this.http.post<GroupTopicApiResponse>(baseUrl + `/groups/${groupId}/topics`, {
      topic,
    });
  }

  deleteGroupTopic(groupId: number | string, topicId: number): Observable<{ code: number; data: { id: number; deleted: boolean } }> {
    return this.http.delete<{ code: number; data: { id: number; deleted: boolean } }>(
      baseUrl + `/groups/${groupId}/topics/${topicId}`
    );
  }

  getAllGroupTopics(): Observable<GroupTopicsApiResponse> {
    return this.http.get<GroupTopicsApiResponse>(baseUrl + `/groups/topics`);
  }
}
