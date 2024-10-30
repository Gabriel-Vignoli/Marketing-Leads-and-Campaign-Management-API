import { HttpError } from "../errors/HttpError";
import {
  CreateGroupAttributes,
  GroupsRepository,
} from "../repositories/GroupsRepository";

export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async getAllGroups() {
    const groups = await this.groupsRepository.find();
    return groups;
  }

  async createGroup(params: CreateGroupAttributes) {
    const newGroup = await this.groupsRepository.create(params);
    return newGroup;
  }

  async findGroupById(id: number) {
    const group = await this.groupsRepository.findById(id);
    if (!group) throw new HttpError(404, "Group not found");
    return group;
  }

  async updateGroupById(id: number, params: Partial<CreateGroupAttributes>) {
    const updatedGroup = await this.groupsRepository.updateById(id, params);
    if (!updatedGroup) throw new HttpError(404, "Group not found");
    return updatedGroup;
  }

  async deleteGroupById(id: number) {
    const deletedGroup = await this.groupsRepository.deleteById(id);
    if (!deletedGroup) throw new HttpError(404, "Group not found");
    return deletedGroup;
  }
}
