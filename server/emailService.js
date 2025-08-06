import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
})

export const sendReminderEmails = async (pool) => {
  try {
    // Get tasks due today or overdue
    const today = new Date().toISOString().split('T')[0]
    const result = await pool.query(`
      SELECT t.*, u.name, u.email 
      FROM tasks t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.due_date <= $1 AND t.status = 'pending'
    `, [today])

    const tasks = result.rows

    // Group tasks by user
    const userTasks = {}
    tasks.forEach(task => {
      if (!userTasks[task.email]) {
        userTasks[task.email] = {
          name: task.name,
          tasks: []
        }
      }
      userTasks[task.email].tasks.push(task)
    })

    // Send emails
    for (const [email, userData] of Object.entries(userTasks)) {
      const taskList = userData.tasks.map(task => {
        const dueDate = new Date(task.due_date)
        const isOverdue = dueDate < new Date()
        return `• ${task.title} ${isOverdue ? '(OVERDUE)' : '(Due Today)'}`
      }).join('\n')

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Task Reminder - Tasks Due Today',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Task Reminder</h2>
            <p>Hello ${userData.name},</p>
            <p>You have the following tasks that are due today or overdue:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <pre style="margin: 0; white-space: pre-wrap;">${taskList}</pre>
            </div>
            <p>Please log in to your Task Manager to update these tasks.</p>
            <p>Best regards,<br>Task Manager Team</p>
          </div>
        `
      }

      try {
        await transporter.sendMail(mailOptions)
        console.log(`Reminder email sent to ${email}`)
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error)
      }
    }

    console.log(`Processed ${Object.keys(userTasks).length} users for email reminders`)
  } catch (error) {
    console.error('Error in sendReminderEmails:', error)
  }
}