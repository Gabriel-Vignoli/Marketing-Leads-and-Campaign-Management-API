import { GroupsRepository } from "../repositories/GroupsRepository";
import { LeadsRepository, LeadWhereParams } from "../repositories/LeadsRepository";
import { HttpError } from "../errors/HttpError";
import { LeadStatus } from "@prisma/client";

interface GetLeadsParams {
  groupId: number;
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadStatus;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
}

export class GroupLeadsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  async getLeadsData(params: GetLeadsParams) {
    const { groupId, page = 1, pageSize = 10, name, status, sortBy, order } = params;
    
    const offset = (page - 1) * pageSize;

    const where: LeadWhereParams = { groupId };

    if (name) where.name = { like: name, mode: "insensitive" };
    if (status) where.status = status;

    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit: pageSize,
      offset,
      include: { groups: true },
    });

    const total = await this.leadsRepository.count(where);

    return {
      data: leads,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async addLeadToGroup(groupId: number, leadId: number) {
    const group = await this.groupsRepository.findById(groupId);
    if (!group) throw new HttpError(404, "Group not found");

    const lead = await this.leadsRepository.findById(leadId);
    if (!lead) throw new HttpError(404, "Lead not found");

    return this.groupsRepository.addLead(groupId, leadId);
  }

  async removeLeadFromGroup(groupId: number, leadId: number) {
    const group = await this.groupsRepository.findById(groupId);
    if (!group) throw new HttpError(404, "Group not found");

    const lead = await this.leadsRepository.findById(leadId);
    if (!lead) throw new HttpError(404, "Lead not found");

    return this.groupsRepository.removeLead(groupId, leadId);
  }
}
