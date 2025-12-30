export const healtCheck  = (req, res)  => {
    return res.status(200).json({
        status: "ok",
        message: "Back-end funcionando"
    })
}