import { HttpError } from "../errors/HttpError";
import {
  CampaignsRepository,
  CreateCampaignAttributes,
} from "../repositories/CampaignsRepository";

export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  async getCampaigns() {
    const campaigns = await this.campaignsRepository.find();
    return campaigns;
  }

  async createCampaigns(params: CreateCampaignAttributes) {
    const campaign = await this.campaignsRepository.create(params);
    return campaign;
  }

  async getcampaignById(id: number) {
    const campaign = await this.campaignsRepository.findById(id);
    if (!campaign) throw new HttpError(404, "Campaign not found");
    return campaign;
  }

  async updateCampaignById(
    id: number,
    params: Partial<CreateCampaignAttributes>
  ) {
    const updatedCampaign = await this.campaignsRepository.updateById(
      id,
      params
    );
    if (!updatedCampaign) throw new HttpError(404, "Campaign not found");
    return updatedCampaign;
  }

  async deleteCampaignById(id: number) {
    const deletedCampaign = await this.campaignsRepository.deleteById(id);
    if (!deletedCampaign) throw new HttpError(404, "Campaign not found");
    return deletedCampaign;
  }
}
