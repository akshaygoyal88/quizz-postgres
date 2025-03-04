import { db } from "@/db";
import { UserNotification } from "@prisma/client";

export async function createNotification(reqData: {userId:string, message: string}) {
    const {userId, message} = reqData;
    if(!userId){
        return {error: "User invalid."}
    }

    if(!message){
        return {error: "Message invalid."}
    }
    const notificationRes = await db.userNotification.create({
        data: {
            userId,
            message
        },
    })
    return notificationRes;
}

export async function getNotifications(userId: string) {
    if(!userId){
        return {error: "User Id missing."}
    }
    const res =  await db.userNotification.findMany({
        where: {userId}
    })
    return res;
}

export async function deleteAll(userId: string) {
    return await db.userNotification.deleteMany({
        where: {userId}
    })
}

export async function updateNotification({reqData,notificationId}: {reqData:UserNotification, notificationId: string}) {
    return await db.userNotification.update({
        where: {id: notificationId},
        data: {
            ...reqData
        }
    })
}

export async function deleteNotification(notificationId: string) {
    return await db.userNotification.delete({
        where: {id:notificationId}
    })
}


export async function createNotiForProfileComplete(userId: string){
    return await createNotification({userId, message: "Profile not completed. Please complete your profile."})
}


