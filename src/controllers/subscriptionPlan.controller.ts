import { Request, Response } from "express";
import { SubscriptionPlanService } from "../services/subscriptionPlan.service";

export class SubscriptionPlanController {
  private subscriptionPlanService = new SubscriptionPlanService();

  /**
   * Create Subscription Plan
   */
  // createPlan = async (req: Request, res: Response) => {
  //   try {
  //     const plan = await this.subscriptionPlanService.createPlan(req.body);

  //     return res.status(201).json({
  //       success: true,
  //       message: "Subscription plan created successfully.",
  //       data: plan,
  //     });
  //   } catch (error: any) {
  //     return res.status(400).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // };

  createPlan = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);

    const plan = await this.subscriptionPlanService.createPlan(req.body);

    return res.status(201).json({
      success: true,
      message: "Subscription plan created successfully.",
      data: plan,
    });
  } catch (error: any) {
    console.error("Create Plan Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
  /**
   * Get All Subscription Plans
   */
  getAllPlans = async (_req: Request, res: Response) => {
    try {
      const plans = await this.subscriptionPlanService.getAllPlans();

      return res.status(200).json({
        success: true,
        message: "Subscription plans fetched successfully.",
        data: plans,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Get Subscription Plan By Id
   */
  getPlanById = async (req: Request, res: Response) => {
    try {
      // const { id } = req.params;

      const id = req.params.id as string;

      const plan = await this.subscriptionPlanService.getPlanById(id);

      return res.status(200).json({
        success: true,
        message: "Subscription plan fetched successfully.",
        data: plan,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Update Subscription Plan
   */
  updatePlan = async (req: Request, res: Response) => {
    try {
      // const { id } = req.params;

      const id = req.params.id as string;

      const updatedPlan = await this.subscriptionPlanService.updatePlan(
        id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Subscription plan updated successfully.",
        data: updatedPlan,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Delete Subscription Plan (Soft Delete)
   */
  deletePlan = async (req: Request, res: Response) => {
    try {
      // const { id } = req.params;

      const id = req.params.id as string;

      await this.subscriptionPlanService.deletePlan(id);

      return res.status(200).json({
        success: true,
        message: "Subscription plan deleted successfully.",
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };
}