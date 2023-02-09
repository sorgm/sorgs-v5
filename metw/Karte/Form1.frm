VERSION 5.00
Object = "{35DFF7C3-DEB3-11D0-8C50-00C04FC29CEC}#1.1#0"; "PICTUREGLASS.OCX"
Begin VB.Form Form1 
   Caption         =   "Form1"
   ClientHeight    =   5955
   ClientLeft      =   45
   ClientTop       =   330
   ClientWidth     =   8400
   LinkTopic       =   "Form1"
   Picture         =   "Form1.frx":0000
   ScaleHeight     =   5955
   ScaleWidth      =   8400
   StartUpPosition =   3  'Windows-Standard
   Begin PictureGlass.XPictureGlass pg 
      Height          =   1335
      Index           =   33
      Left            =   6610
      TabIndex        =   3
      ToolTipText     =   "Pferdeebenen"
      Top             =   2470
      Width           =   1635
      _ExtentX        =   2884
      _ExtentY        =   2355
      BackColor       =   -2147483628
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ScaleWidth      =   1635
      ScaleHeight     =   1335
      Picture         =   "Form1.frx":26899
      MaskColor       =   -2147483643
   End
   Begin PictureGlass.XPictureGlass pg 
      Height          =   1875
      Index           =   43
      Left            =   6270
      TabIndex        =   2
      ToolTipText     =   "Khand"
      Top             =   4090
      Width           =   2355
      _ExtentX        =   6482
      _ExtentY        =   5636
      BackColor       =   -2147483628
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ScaleWidth      =   619,714
      ScaleMode       =   0
      ScaleHeight     =   378,959
      Picture         =   "Form1.frx":27772
      MaskColor       =   -2147483643
   End
   Begin PictureGlass.XPictureGlass pg 
      Height          =   1695
      Index           =   47
      Left            =   6120
      TabIndex        =   1
      ToolTipText     =   "Nurn"
      Top             =   3600
      Width           =   2265
      _ExtentX        =   6535
      _ExtentY        =   5133
      BackColor       =   -2147483628
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ScaleWidth      =   118,236
      ScaleMode       =   0
      ScaleHeight     =   66,196
      Picture         =   "Form1.frx":2926F
      MaskColor       =   -2147483643
   End
   Begin PictureGlass.XPictureGlass pg 
      Height          =   840
      Index           =   46
      Left            =   5920
      TabIndex        =   0
      ToolTipText     =   "Gorgoroth"
      Top             =   3600
      Width           =   975
      _ExtentX        =   2805
      _ExtentY        =   2328
      BackColor       =   -2147483628
      ForeColor       =   -2147483640
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ScaleWidth      =   51,838
      ScaleMode       =   0
      ScaleHeight     =   55,784
      Picture         =   "Form1.frx":2B21E
      MaskColor       =   -2147483643
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Private Sub pg_Click(Index As Integer)
    MsgBox pg(Index).ToolTipText
End Sub

